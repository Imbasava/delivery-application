import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const SenderDetailsPage = () => {
  // Use React Router's navigate hook
  const navigate = useNavigate();
 
  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    if (userId) {
      fetch(`http://localhost:8080/api/bookings/user/check/${userId}/ids`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text(); // Get the response as plain text first
        })
        .then((text) => {
          console.log('Raw response text:', text); // Log the raw text
          try {
            // More aggressive cleaning - extract JSON using regex
            const jsonMatch = text.match(/\{.*\}/);
            if (jsonMatch) {
              const extractedJson = jsonMatch[0];
              const data = JSON.parse(extractedJson);
              console.log('Fetched data:', data);
              if (data.tripId && data.travelerId !== undefined) {
                localStorage.setItem('tripId', JSON.stringify(data.tripId));
                localStorage.setItem('travelerId', JSON.stringify(data.travelerId));
              }
            } else {
              throw new Error('No JSON object found in response');
            }
          } catch (error) {
            console.error('Failed to parse JSON:', error, 'Text received:', text);
          }
        })
        .catch((error) => {
          console.error('Error fetching trip and traveler IDs:', error);
        });
    } else {
      console.error('User ID not found in localStorage');
    }
  }, []);
  
  
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-900 via-teal-700 to-blue-900 text-white">
      {/* Sidebar */}
      <div className="w-64 p-6 bg-teal-800 flex flex-col shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-100">Sender Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          <button 
            onClick={() => navigate('/')} 
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-left rounded-lg transition duration-300 shadow-md"
          >
            Home
          </button>
          <button   
            onClick={() => navigate('/sender-chat')} 
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-left rounded-lg transition duration-300 shadow-md"> 
            Chat
          </button>
          <button 
            onClick={() => navigate('/track-items')} 
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-left rounded-lg transition duration-300 shadow-md"
          >
            History
          </button>
          <button 
            onClick={() => navigate('/courier-payment')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-left rounded-lg transition duration-300 shadow-md">
            Payments   
          </button>
          <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-left rounded-lg transition duration-300 shadow-md">
            Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center p-8">
        <div className="w-full max-w-lg p-8 space-y-6 bg-white shadow-2xl rounded-2xl text-gray-800">
          <h2 className="text-3xl font-bold text-center text-teal-700">What would you like to do?</h2>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => navigate('/find-travelers')}
              className="w-full px-4 py-2 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-600 focus:ring-4 focus:ring-teal-400 focus:outline-none transform hover:scale-105 transition duration-300"
            >
              Find Travelers
            </button>
            <button
              onClick={() => navigate('/track-items')}
              className="w-full px-4 py-2 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-600 focus:ring-4 focus:ring-teal-400 focus:outline-none transform hover:scale-105 transition duration-300"
            >
              Track My Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
