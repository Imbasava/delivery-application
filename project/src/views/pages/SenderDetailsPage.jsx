import React, { useState } from 'react';

export const SenderDetailsPage = () => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate form submission
    console.log({
      itemName,
      description,
      weight,
      pickupDate,
      additionalDetails,
    });

    setMessage('Details submitted successfully!');
    // Clear the form fields after submission
    setItemName('');
    setDescription('');
    setWeight('');
    setPickupDate('');
    setAdditionalDetails('');
  };

  return (
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
        <div className="w-full max-w-lg p-8 space-y-6 bg-white shadow-2xl rounded-2xl text-gray-800 transform hover:scale-105 transition duration-300">
          <h2 className="text-3xl font-bold text-center text-teal-700">Sender Details</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Item Name */}
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

            {/* Description */}
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

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-600" htmlFor="weight">
                Weight (in kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="Enter item weight"
              />
            </div>

            {/* Pickup Date */}
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

            {/* Additional Details */}
            <div>
              <label className="block text-sm font-medium text-gray-600" htmlFor="additionalDetails">
                Additional Details
              </label>
              <textarea
                id="additionalDetails"
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="Enter any additional details"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-600 focus:ring-4 focus:ring-teal-400 focus:outline-none transform hover:scale-105 transition duration-300"
            >
              Submit
            </button>
          </form>

          {/* Display Message */}
          {message && (
            <div className="mt-4 text-center text-sm font-medium text-green-600">{message}</div>
          )}
        </div>
      </div>
    </div>
  );
};
