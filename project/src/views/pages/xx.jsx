import React, { useState } from 'react';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAwujdMkdhfqoEjqBcj6eOXMIBH35ZIbQ8'; // Replace with your API key

export const SenderDetailsPage = () => {
  const [view, setView] = useState('options'); // Tracks whether to show options or form
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [message, setMessage] = useState('');
  
  // Add state for coordinates
  const [pickupLatitude, setPickupLatitude] = useState('');
  const [pickupLongitude, setPickupLongitude] = useState('');
  const [dropoffLatitude, setDropoffLatitude] = useState('');
  const [dropoffLongitude, setDropoffLongitude] = useState('');

  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [dropAutocomplete, setDropAutocomplete] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      senderName,
      senderContact,
      itemName,
      description,
      weight,
      pickupDate,
      pickupLocation,
      dropLocation,
      pickupLatitude,
      pickupLongitude,
      dropoffLatitude,
      dropoffLongitude,
      additionalDetails,
    });

    setMessage('Details submitted successfully!');
    setSenderName('');
    setSenderContact('');
    setItemName('');
    setDescription('');
    setWeight('');
    setPickupDate('');
    setPickupLocation('');
    setDropLocation('');
    setPickupLatitude('');
    setPickupLongitude('');
    setDropoffLatitude('');
    setDropoffLongitude('');
    setAdditionalDetails('');
  };

  const handlePickupPlaceChanged = () => {
    if (pickupAutocomplete) {
      const place = pickupAutocomplete.getPlace();
      setPickupLocation(place.formatted_address || '');
      
      // Get latitude and longitude
      if (place.geometry && place.geometry.location) {
        setPickupLatitude(place.geometry.location.lat());
        setPickupLongitude(place.geometry.location.lng());
      }
    }
  };

  const handleDropPlaceChanged = () => {
    if (dropAutocomplete) {
      const place = dropAutocomplete.getPlace();
      setDropLocation(place.formatted_address || '');
      
      // Get latitude and longitude
      if (place.geometry && place.geometry.location) {
        setDropoffLatitude(place.geometry.location.lat());
        setDropoffLongitude(place.geometry.location.lng());
      }
    }
  };

  // Rest of your component remains the same...
  
    return (
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <div className="min-h-screen flex bg-gradient-to-br from-green-900 via-teal-700 to-blue-900 text-white">
          {/* Sidebar */}
          <div className="w-64 p-6 bg-teal-800 flex flex-col shadow-lg">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-100">Sender Dashboard</h2>
            <nav className="flex flex-col space-y-4">
              <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-left rounded-lg transition duration-300 shadow-md">
                Chat
              </button>
              <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-left rounded-lg transition duration-300 shadow-md">
                History
              </button>
              <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-left rounded-lg transition duration-300 shadow-md">
                Payments
              </button>
              <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-left rounded-lg transition duration-300 shadow-md">
                Settings
              </button>
            </nav>
          </div>
  
          {/* Main Content */}
          <div className="flex-grow flex flex-col items-center p-8">
            {view === 'options' && (
              <div className="w-full max-w-lg p-8 space-y-6 bg-white shadow-2xl rounded-2xl text-gray-800">
                <h2 className="text-3xl font-bold text-center text-teal-700">What would you like to do?</h2>
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => setView('addItem')}
                    className="w-full px-4 py-2 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-600 focus:ring-4 focus:ring-teal-400 focus:outline-none transform hover:scale-105 transition duration-300"
                  >
                    Add New Item
                  </button>
                  <button
                    onClick={() => setView('trackItem')}
                    className="w-full px-4 py-2 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-600 focus:ring-4 focus:ring-teal-400 focus:outline-none transform hover:scale-105 transition duration-300"
                  >
                    Track Previous Items
                  </button>
                </div>
              </div>
            )}
  
            {view === 'addItem' && (
              <div className="w-full max-w-lg p-8 space-y-6 bg-white shadow-2xl rounded-2xl text-gray-800">
                <h2 className="text-3xl font-bold text-center text-teal-700">Sender Details</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-600" htmlFor="senderName">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      id="senderName"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Enter sender name"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-600" htmlFor="senderContact">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      id="senderContact"
                      value={senderContact}
                      onChange={(e) => setSenderContact(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Enter contact number"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-600" htmlFor="itemName">
                      Item Name
                    </label>
                    <input
                      type="text"
                      id="itemName"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Enter item name"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-600" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Enter item description"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-600" htmlFor="weight">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Enter weight"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-600" htmlFor="pickupDate">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      id="pickupDate"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-600" htmlFor="pickupLocation">
                      Pickup Location
                    </label>
                    <Autocomplete
                      onLoad={(autocomplete) => setPickupAutocomplete(autocomplete)}
                      onPlaceChanged={handlePickupPlaceChanged}
                    >
                      <input
                        type="text"
                        id="pickupLocation"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="Enter pickup location"
                      />
                    </Autocomplete>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-600" htmlFor="dropLocation">
                      Drop Location
                    </label>
                    <Autocomplete
                      onLoad={(autocomplete) => setDropAutocomplete(autocomplete)}
                      onPlaceChanged={handleDropPlaceChanged}
                    >
                      <input
                        type="text"
                        id="dropLocation"
                        value={dropLocation}
                        onChange={(e) => setDropLocation(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="Enter drop location"
                      />
                    </Autocomplete>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-600" htmlFor="additionalDetails">
                      Additional Details
                    </label>
                    <textarea
                      id="additionalDetails"
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Enter additional details"
                    />
                  </div>
  
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-600 focus:ring-4 focus:ring-teal-400 focus:outline-none transform hover:scale-105 transition duration-300"
                  >
                    Submit
                  </button>
                </form>
  
                {message && (
                  <div className="mt-4 text-center text-sm font-medium text-green-600">{message}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </LoadScript>
    );
  
}
