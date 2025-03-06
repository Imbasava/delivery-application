import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  // State for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for error/success messages
  const [message, setMessage] = useState('');

  // Navigation hook
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    // Backend URL
    const apiUrl = 'http://localhost:8080/api/users/login';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json(); // Parse JSON response
        console.log('Login success response:', data);
        setMessage(`Welcome, ${data.firstName || 'User'}!`);

        // Navigate to the home page
        navigate('/'); // Adjust the route to match your application's home page
      } else {
        const errorData = await response.json(); // Handle error JSON response
        console.error('Login error response:', errorData);
        setMessage(errorData.message || 'Invalid login credentials.');
      }
    } catch (error) {
      console.error('Login request failed:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-sky-600 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-lg text-gray-800">
        <h2 className="text-3xl font-bold text-center text-sky-600">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-600" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-sky-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-600" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-sky-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 focus:ring focus:ring-sky-400 focus:outline-none"
          >
            Login
          </button>
        </form>

        {/* Display Messages */}
        {message && (
          <div className="mt-4 text-center text-sm font-medium text-red-500">{message}</div>
        )}

        {/* Links */}
        <div className="text-center">
          <p className="text-sm">
            <a href="/signup" className="text-sky-600 hover:underline">
              Sign Up
            </a>{' '}
            |{' '}
            <a href="/forgot-password" className="text-sky-600 hover:underline ml-1">
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
