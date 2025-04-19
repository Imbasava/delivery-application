import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';

export const CourierPayment = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Get userId from localStorage
  
  // We'll now get all necessary IDs from localStorage
  const tripId = localStorage.getItem('tripId') ? JSON.parse(localStorage.getItem('tripId')) : null;
  
  const [bookingId, setBookingId] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  const [paymentInfo, setPaymentInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Load Razorpay script and fetch necessary IDs
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    };

    loadRazorpayScript();
    
    // Get bookingId if not already in state
    const fetchBookingId = async () => {
      if (!userId) {
        setError("User ID not found. Please login again.");
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`/api/bookings/user/check/${userId}/ids`);
        console.log("User booking data:", response.data);
        
        if (response.data.bookingId) {
          setBookingId(response.data.bookingId);
        } else {
          console.warn("No booking ID found in response");
        }
      } catch (err) {
        console.error("Error fetching booking ID:", err);
      }
    };
    
    // Fetch trip details
    const fetchTripDetails = async () => {
      if (!tripId) {
        setError("Trip ID not found. Please go back to the booking page.");
        setLoading(false);
        return;
      }
      
      try {
        console.log("Fetching trip details for tripId:", tripId);
        const response = await axios.get(`http://localhost:8080/api/trips/${tripId}`);
        console.log("Trip details response:", response.data);
        setTripDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trip details:", err);
        setError("Failed to load trip details");
        setLoading(false);
      }
    };
    
    fetchBookingId();
    fetchTripDetails();
  }, [userId, tripId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateBookingStatus = async (status) => {
    // Parse tripId from localStorage consistently, just like you did at the top of the component
    const tripId = localStorage.getItem('tripId') ? JSON.parse(localStorage.getItem('tripId')) : null;
    if (!tripId) {
        console.error("Cannot update status: No trip ID available"); // Update error message to reference tripId
        return false;
    }
    try {
        const response = await axios.put(`http://localhost:8080/api/bookings/trip/${tripId}/status`, { status });
        console.log("Status update response:", response.data);
        return true;
    } catch (error) {
        console.error("Error updating booking status:", error);
        return false;
    }
};

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!scriptLoaded) {
      alert("Razorpay is still loading. Please wait.");
      return;
    }
    
    if (!tripDetails || !tripDetails.courierFee) {
      alert("Cannot process payment: Missing trip details or fee amount");
      return;
    }
    
    try {
      const options = {
        key: 'rzp_test_KA0MVYPAHSnecF', // Replace with your key
        amount: tripDetails.courierFee * 100, // Amount in paise
        currency: 'INR',
        name: 'Courier Service',
        description: 'Payment for Courier Service',
        handler: async function(response) {
          console.log("Payment response:", response);
          
          // Payment is successful, update booking status and redirect
          if (response.razorpay_payment_id) {
            try {
              const statusUpdated = await updateBookingStatus("finished");
              
              if (statusUpdated) {
                alert("Payment successful! Your booking status has been updated.");
              } else {
                alert("Payment successful, but there was an issue updating the booking status.");
              }
              
              navigate('/sender-details'); // Redirect to dashboard or confirmation page
            } catch (error) {
              console.error("Error after payment:", error);
              alert("Payment successful, but there was an issue updating our records.");
            }
          }
        },
        prefill: {
          name: paymentInfo.name,
          email: paymentInfo.email,
          contact: paymentInfo.phone
        },
        notes: {
          tripId: tripId,
          userId: userId,
          bookingId: bookingId
        },
        theme: {
          color: '#3f51b5'
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Complete Payment
        </Typography>
        
        <Box sx={{ my: 3 }}>
          <Typography variant="h6">Trip Details</Typography>
          <Typography>From: {tripDetails?.origin || 'N/A'}</Typography>
          <Typography>To: {tripDetails?.destination || 'N/A'}</Typography>
          <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
            Amount to Pay: ₹{tripDetails?.courierFee || 0}
          </Typography>
        </Box>
        
        <form onSubmit={handlePayment}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="name"
                value={paymentInfo.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={paymentInfo.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                name="phone"
                value={paymentInfo.phone}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={!scriptLoaded}
              >
                Pay Now
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CourierPayment;