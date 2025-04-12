import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SenderDetailsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-900 via-teal-700 to-blue-900 text-white">
      {/* Sidebar */}
      <div className="w-64 p-6 bg-teal-800 flex flex-col shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-100">Sender Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          <button 
            onClick={() => navigate('/home')} 
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-left rounded-lg transition duration-300 shadow-md"
          >
            Home
          </button>
          <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-left rounded-lg transition duration-300 shadow-md">
            Chat
          </button>
          <button 
            onClick={() => navigate('/track-items')} 
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-left rounded-lg transition duration-300 shadow-md"
          >
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
