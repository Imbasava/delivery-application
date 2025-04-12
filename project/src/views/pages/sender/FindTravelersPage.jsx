import React, { useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = "AIzaSyAwujdMkdhfqoEjqBcj6eOXMIBH35ZIbQ8"; // Replace with your API key
const LIBRARIES = ["places"];

export const FindTravelersPage = ({ onBack, onRouteSelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const [origin, setOrigin] = useState("");
  const [originLatLng, setOriginLatLng] = useState({ lat: null, lng: null });
  const [destination, setDestination] = useState("");
  const [destinationLatLng, setDestinationLatLng] = useState({ lat: null, lng: null });
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleOriginChange = (placeResult) => {
    if (placeResult?.geometry?.location) {
      setOrigin(placeResult.formatted_address);
      setOriginLatLng({
        lat: placeResult.geometry.location.lat(),
        lng: placeResult.geometry.location.lng(),
      });
    }
  };

  const handleDestinationChange = (placeResult) => {
    if (placeResult?.geometry?.location) {
      setDestination(placeResult.formatted_address);
      setDestinationLatLng({
        lat: placeResult.geometry.location.lat(),
        lng: placeResult.geometry.location.lng(),
      });
    }
  };

  const handleFindTravelers = async () => {
    if (!origin || !destination) {
      alert("Please provide both origin and destination locations.");
      return;
    }

    const routeData = {
      origin,
      originLatLng,
      destination,
      destinationLatLng,
    };

    if (typeof onRouteSelect === "function") {
      onRouteSelect(routeData);
    }

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/trips/nearby", {
        params: {
          originLat: originLatLng.lat,
          originLng: originLatLng.lng,
          destLat: destinationLatLng.lat,
          destLng: destinationLatLng.lng,
          limit: 10,
        },
      });

      setTravelers(response.data);
      setSearched(true);
    } catch (error) {
      console.error("Error fetching travelers:", error);
      alert("Failed to fetch travelers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl p-8 space-y-6 bg-white shadow-2xl rounded-2xl text-gray-800">
        <h2 className="text-3xl font-bold text-center text-teal-700">Find Travelers</h2>

        <div className="flex flex-col items-center space-y-4">
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">Origin</label>
            <PlaceAutocompleteElement
              id="origin"
              onPlaceChanged={handleOriginChange}
              placeholder="Enter origin location"
            />
          </div>

          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">Destination</label>
            <PlaceAutocompleteElement
              id="destination"
              onPlaceChanged={handleDestinationChange}
              placeholder="Enter destination location"
            />
          </div>

          <div className="flex justify-between w-full">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 focus:ring-4 focus:ring-gray-400 focus:outline-none transform hover:scale-105 transition duration-300"
            >
              Back
            </button>
            <button
              onClick={handleFindTravelers}
              disabled={loading}
              className="px-4 py-2 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-600 focus:ring-4 focus:ring-teal-400 focus:outline-none transform hover:scale-105 transition duration-300 disabled:bg-teal-300 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Find Travelers"}
            </button>
          </div>
        </div>

        {searched && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-teal-700 text-center">
              {travelers.length > 0
                ? `Found ${travelers.length} Travelers`
                : "No travelers found for this route"}
            </h3>

            {travelers.length > 0 && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {travelers.map((item, index) => (
                  <div
                    key={item.trip.tripId}
                    className="p-4 bg-teal-50 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Trip #{item.trip.tripId}</h4>
                        <p className="text-sm text-gray-500">Traveler ID: {item.trip.travelerId}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">
                          {formatDistance(item.distance)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Origin</p>
                        <p className="text-sm truncate">{item.trip.origin}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Destination</p>
                        <p className="text-sm truncate">{item.trip.destination}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Date</p>
                        <p className="text-sm">{item.trip.arrivalDate}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Time</p>
                        <p className="text-sm">
                          {formatTime(item.trip.departureTime)} - {formatTime(item.trip.arrivalTime)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                        onClick={() => alert(`Contact traveler ${item.trip.travelerId}`)}
                      >
                        Contact Traveler
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PlaceAutocompleteElement = ({ id, onPlaceChanged, placeholder }) => {
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current);
    autocomplete.addListener("place_changed", () => onPlaceChanged(autocomplete.getPlace()));

    return () => google.maps.event.clearInstanceListeners(autocomplete);
  }, [onPlaceChanged]);

  return (
    <input
      id={id}
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
    />
  );
};
