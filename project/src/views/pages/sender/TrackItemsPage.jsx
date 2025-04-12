import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const TrackItemsPage = ({ onBack }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch user's deliveries
    const fetchDeliveries = async () => {
      setLoading(true);
      try {
        // In a real app, you would authenticate the user and fetch their deliveries
        // For now, we'll use mock data
        // const response = await axios.get('http://localhost:8080/api/deliveries/user');
        
        // Mock data for demonstration
        const mockDeliveries = [
          {
            id: 'DEL-1001',
            itemName: 'Laptop',
            status: 'in-transit',
            pickupLocation: 'New York, NY',
            dropLocation: 'Boston, MA',
            pickupDate: '2025-04-15',
            travelerName: 'John Smith',
            travelerContact: '+1-555-123-4567',
            expectedDeliveryDate: '2025-04-16',
            currentLocation: 'Hartford, CT',
            lastUpdated: '2025-04-15T14:30:00Z',
            trackingEvents: [
              { time: '2025-04-15T09:00:00Z', status: 'Picked up', location: 'New York, NY' },
              { time: '2025-04-15T12:15:00Z', status: 'In transit', location: 'Hartford, CT' },
              { time: '2025-04-15T14:30:00Z', status: 'On schedule', location: 'Hartford, CT' }
            ]
          },
          {
            id: 'DEL-1002',
            itemName: 'Documents Package',
            status: 'delivered',
            pickupLocation: 'Chicago, IL',
            dropLocation: 'Detroit, MI',
            pickupDate: '2025-04-10',
            travelerName: 'Alice Johnson',
            travelerContact: '+1-555-987-6543',
            expectedDeliveryDate: '2025-04-11',
            currentLocation: 'Detroit, MI',
            lastUpdated: '2025-04-11T16:45:00Z',
            trackingEvents: [
              { time: '2025-04-10T10:30:00Z', status: 'Picked up', location: 'Chicago, IL' },
              { time: '2025-04-10T15:45:00Z', status: 'In transit', location: 'Gary, IN' },
              { time: '2025-04-11T09:20:00Z', status: 'In transit', location: 'Kalamazoo, MI' },
              { time: '2025-04-11T16:45:00Z', status: 'Delivered', location: 'Detroit, MI' }
            ]
          },
          {
            id: 'DEL-1003',
            itemName: 'Birthday Gift',
            status: 'pending',
            pickupLocation: 'San Francisco, CA',
            dropLocation: 'Los Angeles, CA',
            pickupDate: '2025-04-18',
            travelerName: 'Robert Chen',
            travelerContact: '+1-555-567-8901',
            expectedDeliveryDate: '2025-04-19',
            currentLocation: 'San Francisco, CA',
            lastUpdated: '2025-04-12T11:15:00Z',
            trackingEvents: [
              { time: '2025-04-12T11:15:00Z', status: 'Request confirmed', location: 'San Francisco, CA' }
            ]
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setDeliveries(mockDeliveries);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching deliveries:', err);
        setError('Failed to load your deliveries. Please try again.');
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDeliveries = deliveries.filter(delivery => 
    delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.travelerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl p-8 space-y-6 bg-white shadow-2xl rounded-2xl text-gray-800">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-teal-700">Track My Items</h2>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-600 transition duration-300"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by ID, item name, or traveler name..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">
          🔍
        </span>
      </div>

      {/* Deliveries List or Detail View */}
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : selectedDelivery ? (
        // Delivery Detail View
        <div className="space-y-6">
          <button
            onClick={() => setSelectedDelivery(null)}
            className="flex items-center text-teal-700 hover:text-teal-500"
          >
            <span>← Back to all deliveries</span>
          </button>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{selectedDelivery.itemName}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDelivery.status)}`}>
                {selectedDelivery.status.charAt(0).toUpperCase() + selectedDelivery.status.slice(1).replace('-', ' ')}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Tracking ID</p>
                <p className="font-medium">{selectedDelivery.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Traveler</p>
                <p className="font-medium">{selectedDelivery.travelerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pickup Location</p>
                <p className="font-medium">{selectedDelivery.pickupLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Destination</p>
                <p className="font-medium">{selectedDelivery.dropLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Location</p>
                <p className="font-medium">{selectedDelivery.currentLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expected Delivery</p>
                <p className="font-medium">{formatDate(selectedDelivery.expectedDeliveryDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{selectedDelivery.travelerContact}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{formatDate(selectedDelivery.lastUpdated)} at {formatTime(selectedDelivery.lastUpdated)}</p>
              </div>
            </div>
            
            {/* Tracking Timeline */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Tracking History</h4>
              <div className="space-y-4">
                {selectedDelivery.trackingEvents.map((event, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full bg-teal-500"></div>
                      {index < selectedDelivery.trackingEvents.length - 1 && (
                        <div className="h-full w-0.5 bg-teal-200 my-1"></div>
                      )}
                    </div>
                    <div className="flex-grow pb-4">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{event.status}</span>
                        <span className="text-sm text-gray-500">{formatDate(event.time)} at {formatTime(event.time)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Contact Traveler Button */}
            <div className="mt-6">
              <button className="w-full px-4 py-2 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-600 focus:ring-4 focus:ring-teal-400 focus:outline-none transition duration-300">
                Contact Traveler
              </button>
            </div>
          </div>
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="text-center p-8">
          {searchTerm ? (
            <p className="text-gray-500">No deliveries found matching "{searchTerm}".</p>
          ) : (
            <p className="text-gray-500">You don't have any deliveries yet.</p>
          )}
        </div>
      ) : (
        // Deliveries List View
        <div className="space-y-4">
          {filteredDeliveries.map((delivery) => (
            <div 
              key={delivery.id} 
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer transition-all duration-200"
              onClick={() => setSelectedDelivery(delivery)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{delivery.itemName}</h3>
                  <p className="text-sm text-gray-600 mt-1">ID: {delivery.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                  {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1).replace('-', ' ')}
                </span>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-500">From:</span> {delivery.pickupLocation}
                </div>
                <div>
                  <span className="text-gray-500">To:</span> {delivery.dropLocation}
                </div>
                <div>
                  <span className="text-gray-500">Traveler:</span> {delivery.travelerName}
                </div>
                <div>
                  <span className="text-gray-500">Expected Delivery:</span> {formatDate(delivery.expectedDeliveryDate)}
                </div>
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <p className="text-xs text-gray-500">Last updated: {formatDate(delivery.lastUpdated)} at {formatTime(delivery.lastUpdated)}</p>
                <button className="text-teal-700 hover:text-teal-500 text-sm font-medium">View Details →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};