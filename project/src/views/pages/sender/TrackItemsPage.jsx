import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, ArrowLeft, Loader, AlertCircle, Info } from 'lucide-react';

export const TrackItemsPage = ({ onBack }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
        if (!userId) {
          setError("User not logged in. Please log in to view your bookings.");
          setLoading(false);
          return;
        }

        // --- MOCK DELAY (Remove in production) ---
        // await new Promise(resolve => setTimeout(resolve, 1500));
        // --- END MOCK DELAY ---

        const response = await axios.get(
          `http://localhost:8080/api/bookings/user/${userId}`
        );

        const receivedBookings = response.data.bookings || response.data;

        if (Array.isArray(receivedBookings)) {
           // Optional: Enhance with mock data if needed during development
           // const enhancedBookings = receivedBookings.map((b, index) => ({
           //   ...b,
           //   bookingId: b.bookingId || `MOCK-${index + 1}`,
           //   productName: b.productName || `Sample Item #${index + 1}`,
           //   status: b.status || ['delivered', 'processing', 'shipped', 'pending', 'cancelled'][Math.floor(Math.random() * 5)],
           //   origin: b.origin || `Origin City ${String.fromCharCode(65 + index)}`,
           //   destination: b.destination || `Destination City ${String.fromCharCode(80 + index)}`,
           //   bookingDate: b.bookingDate || new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
           //   estimatedDelivery: b.estimatedDelivery || (Math.random() > 0.2 ? new Date(Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000).toLocaleDateString() : 'N/A'),
           // }));
           // setBookings(enhancedBookings);

           setBookings(receivedBookings); // Use actual data
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Received invalid data format from the server.");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data.message || 'Failed to load bookings.'}`);
        } else if (err.request) {
          setError("Could not connect to the server. Please check your connection.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingId?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClasses = (status) => {
    const lowerStatus = status?.toLowerCase() || 'unknown';
    switch (lowerStatus) {
      case 'delivered':
        return {
          badge: "bg-green-100 text-green-800 border border-green-200",
          border: "border-green-500"
        };
      case 'shipped':
      case 'processing':
      case 'in transit':
         return {
          badge: "bg-blue-100 text-blue-800 border border-blue-200",
          border: "border-blue-500"
        };
      case 'pending':
      case 'booked':
        return {
          badge: "bg-yellow-100 text-yellow-800 border border-yellow-200",
          border: "border-yellow-500"
        };
      case 'cancelled':
      case 'failed':
        return {
          badge: "bg-red-100 text-red-800 border border-red-200",
          border: "border-red-500"
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-800 border border-gray-200",
          border: "border-gray-400" // A neutral border for unknown status
        };
    }
  };

  return (
    // *** Added Background Wrapper Div ***
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">

      {/* Original Content Card - slightly adjusted max-width */}
      <div className="w-full max-w-6xl mx-auto p-6 md:p-8 space-y-8 bg-white shadow-2xl rounded-2xl text-gray-800 border border-gray-200/50">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
            Track Your Shipments
          </h1>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by product, status, location, or ID..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
            aria-label="Search bookings"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-teal-600">
            <Search size={20} />
          </span>
        </div>

        {/* Content Area */}
        <div className="min-h-[300px]"> {/* Ensures minimum height */}
          {loading ? (
            <div className="flex flex-col items-center justify-center text-center p-10 text-teal-600">
              <Loader size={48} className="animate-spin mb-4" />
              <p className="text-lg font-medium">Loading your bookings...</p>
              <p className="text-sm text-gray-500">Please wait a moment.</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center p-10 bg-red-50 border-2 border-dashed border-red-200 rounded-lg text-red-700">
              <AlertCircle size={48} className="mb-4 text-red-500" />
              <p className="text-lg font-semibold">Oops! Something went wrong.</p>
              <p className="mt-1 text-sm max-w-md">{error}</p> { /* Limit width of long errors */}
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-5">
              {filteredBookings.map((booking) => {
                 const statusStyle = getStatusClasses(booking.status);
                 return (
                  <div
                    key={booking.bookingId}
                    className={`bg-white border ${statusStyle.border} border-l-[6px] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden transform hover:scale-[1.02]`} // Added hover scale effect
                  >
                    <div className="p-5">
                      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                        {/* Left Side: Product Info & Status */}
                        <div className="flex-grow">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
                            {booking.productName || "N/A"}
                          </h3>
                          <p className="text-xs text-gray-500 mb-3">
                            Booking ID: <span className="font-medium text-gray-600">{booking.bookingId || "N/A"}</span>
                          </p>
                          <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full leading-tight ${statusStyle.badge}`}
                          >
                            {booking.status ? booking.status.toUpperCase() : "UNKNOWN"}
                          </span>
                        </div>

                        {/* Right Side: Origin/Destination & Dates */}
                        <div className="flex-shrink-0 w-full md:w-auto md:max-w-[55%] grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mt-3 md:mt-0">
                          <div>
                            <p className="font-medium text-gray-500">Origin:</p>
                            <p className="text-gray-700">{booking.origin || "N/A"}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-500">Destination:</p>
                            <p className="text-gray-700">{booking.destination || "N/A"}</p>
                          </div>
                          {booking.bookingDate && (
                              <div className="mt-2 sm:mt-0">
                                  <p className="font-medium text-gray-500">Booked On:</p>
                                  <p className="text-gray-700">{booking.bookingDate}</p>
                              </div>
                          )}
                          {booking.estimatedDelivery && booking.estimatedDelivery !== 'N/A' && (
                              <div className="mt-2 sm:mt-0">
                                  <p className="font-medium text-gray-500">Est. Delivery:</p>
                                  <p className="text-gray-700">{booking.estimatedDelivery}</p>
                              </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                 );
                })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-10 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-lg text-gray-500 shadow-inner">
              <Info size={48} className="mb-4 text-gray-400" />
              <p className="text-lg font-semibold text-gray-700">No Bookings Found</p>
              <p className="mt-1 text-sm">
                {searchTerm
                  ? "We couldn't find any bookings matching your search."
                  : "Looks like you haven't made any bookings yet!"}
              </p>
            </div>
          )}
        </div>
      </div>

    </div> // *** Closing Background Wrapper Div ***
  );
};