 

import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  Box,
  Paper,
  Avatar,
  useTheme,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { GoogleMap, useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];
const googleMapsApiKey = "AIzaSyAiXYyUq4gWA6wpas9w9SgvTh0C99XAAKQ";

export const TravelerDetailsPage = () => {





  const API_BASE_URL = "http://localhost:8080/api"; // Update with your actual backend URL
  
  const submitTripDetails = async () => {
    try {
      // Get traveler_id from local storage
      const travelerId = localStorage.getItem("userId"); // Make sure this key matches what you store
      
      if (!travelerId) {
        alert("User not logged in. Please log in again.");
        navigate("/login");
        return;
      }
      
      // Validate required fields
      if (!formValues.departingFrom || !formValues.destination || 
          !formValues.departureDate || !formValues.departureTime ||
          !formValues.arrivalDate || !formValues.arrivalTime ||
          !formValues.departingLatLng || !formValues.destinationLatLng) {
        alert("Please fill in all required fields");
        return;
      }
  
      const formatDateTime = (date, time) => {
        // Format: YYYY-MM-DDThh:mm:ss
        return `${date}T${time}:00`;
      };
      
      const tripData = {
        travelerId: parseInt(travelerId),
        origin: formValues.departingFrom,
        originLatitude: formValues.departingLatLng?.lat,
        originLongitude: formValues.departingLatLng?.lng,
        destination: formValues.destination,
        destinationLatitude: formValues.destinationLatLng?.lat,
        destinationLongitude: formValues.destinationLatLng?.lng,
        departureDate: formatDateTime(formValues.departureDate, formValues.departureTime),
        arrivalDate: formatDateTime(formValues.arrivalDate, formValues.arrivalTime),
        departureTime: formatDateTime(formValues.departureDate, formValues.departureTime),
        arrivalTime: formatDateTime(formValues.arrivalDate, formValues.arrivalTime),
        status: "available"
      };
      
      console.log("Payload being sent:", tripData);
      
      // Get auth token
      const token = localStorage.getItem("token");
      
      // Send data to backend
      const response = await axios.post(
        `${API_BASE_URL}/trips`, 
        tripData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.status === 201 || response.status === 200) {
        // Navigate to success page or trip list
        alert("Trip created successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Failed to create trip. Please try again.");
    }
  };
  

  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({
    departingFrom: "",
    departureDate: "",
    departureTime: "",
    destination: "",
    arrivalDate: "",
    arrivalTime: "",
    departingLatLng: { lat: null, lng: null },
    destinationLatLng: { lat: null, lng: null },
    packageType: "",
    dimensions: "",
  });

  const steps = ["Journey Details", "Package Details", "Confirmation"];

  const [autocompleteFrom, setAutocompleteFrom] = useState(null);
  const [autocompleteTo, setAutocompleteTo] = useState(null);

  const onLoadFrom = (autocomplete) => {
    setAutocompleteFrom(autocomplete);
  };

  const onLoadTo = (autocomplete) => {
    setAutocompleteTo(autocomplete);
  };

  const onPlaceChangedFrom = () => {
    if (autocompleteFrom !== null) {
      const place = autocompleteFrom.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setFormValues((prev) => ({
        ...prev,
        departingFrom: place.formatted_address,
        departingLatLng: { lat, lng },
      }));
    }
  };

  const onPlaceChangedTo = () => {
    if (autocompleteTo !== null) {
      const place = autocompleteTo.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setFormValues((prev) => ({
        ...prev,
        destination: place.formatted_address,
        destinationLatLng: { lat, lng },
      }));
    }
  };

  const handleFormChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  // Update handleNext to submit form on final step
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // On the last step, submit data to backend
      submitTripDetails();
    } else {
      // Otherwise just go to next step as before
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("firstName"); // Remove user name if stored
    navigate("/login"); // Redirect to login page
};

  const drawerWidth = 240;

  const renderStepContent = (step) => {
    if (!isLoaded) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Typography variant="h6">Loading maps...</Typography>
        </Box>
      );
    }

    switch (step) {
      case 0:
        return (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Departing From</Typography>
              <Autocomplete onLoad={onLoadFrom} onPlaceChanged={onPlaceChangedFrom}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={formValues.departingFrom}
                  onChange={(e) => handleFormChange("departingFrom", e.target.value)}
                  placeholder="Enter starting location"
                  sx={{ mb: 2 }}
                />
              </Autocomplete>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Departure Date</Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    type="date"
                    value={formValues.departureDate}
                    onChange={(e) => handleFormChange("departureDate", e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Departure Time</Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    type="time"
                    value={formValues.departureTime}
                    onChange={(e) => handleFormChange("departureTime", e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Destination</Typography>
              <Autocomplete onLoad={onLoadTo} onPlaceChanged={onPlaceChangedTo}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={formValues.destination}
                  onChange={(e) => handleFormChange("destination", e.target.value)}
                  placeholder="Enter destination"
                  sx={{ mb: 2 }}
                />
              </Autocomplete>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Expected Arrival Date</Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    type="date"
                    value={formValues.arrivalDate}
                    onChange={(e) => handleFormChange("arrivalDate", e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Expected Arrival Time</Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    type="time"
                    value={formValues.arrivalTime}
                    onChange={(e) => handleFormChange("arrivalTime", e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            
            {formValues.departingLatLng.lat && formValues.destinationLatLng.lat && (
              <Box sx={{ mt: 4, height: '200px', borderRadius: 2, overflow: 'hidden' }}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={formValues.departingLatLng}
                  zoom={10}
                  options={{ disableDefaultUI: true }}
                >
                </GoogleMap>
              </Box>
            )}
          </Paper>
        );
      case 1:
        return (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Package Type</Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={formValues.packageType}
                onChange={(e) => handleFormChange("packageType", e.target.value)}
                placeholder="E.g., Below 10kg, Fragile"
              />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>Dimensions (LxWxH)</Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={formValues.dimensions}
                onChange={(e) => handleFormChange("dimensions", e.target.value)}
                placeholder="Enter dimensions in cm"
              />
            </Box>
          </Paper>
        );
      case 2:
        return (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>Trip Summary</Typography>
            <Box sx={{ mb: 3, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="subtitle2" color="textSecondary">Departing From</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{formValues.departingFrom}</Typography>
              <Typography variant="caption" color="textSecondary">
                Coordinates: {formValues.departingLatLng.lat?.toFixed(4)}, {formValues.departingLatLng.lng?.toFixed(4)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Departure: {formValues.departureDate} at {formValues.departureTime}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="subtitle2" color="textSecondary">Destination</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{formValues.destination}</Typography>
              <Typography variant="caption" color="textSecondary">
                Coordinates: {formValues.destinationLatLng.lat?.toFixed(4)}, {formValues.destinationLatLng.lng?.toFixed(4)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Expected Arrival: {formValues.arrivalDate} at {formValues.arrivalTime}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">Package Details</Typography>
              <Typography variant="body1">{formValues.packageType}</Typography>
              <Typography variant="body2">Dimensions: {formValues.dimensions}</Typography>
            </Box>
            
            {formValues.departingLatLng.lat && formValues.destinationLatLng.lat && (
              <Box sx={{ mt: 4, height: '200px', borderRadius: 2, overflow: 'hidden' }}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={formValues.departingLatLng}
                  zoom={10}
                  options={{ disableDefaultUI: true }}
                >
                </GoogleMap>
              </Box>
            )}
          </Paper>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  const sidebarContent = (
    <>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.primary.main,
            mb: 1,
          }}
        >
          JD
        </Avatar>
        <Typography variant="h6">John Doe</Typography>
        <Typography variant="body2">Traveler</Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button selected>
          <ListItemText primary="My Shipments" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Messages" />
        </ListItem>
        <ListItem button onClick={() => navigate("/profile")}> {/* Navigate to Profile */}
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
            </ListItem>
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          ml: { sm: `${drawerOpen ? drawerWidth : 0}px` },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            Menu
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Package Delivery Service
          </Typography>
          <IconButton color="inherit">
            Notifications
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          ml: { sm: `${drawerOpen ? drawerWidth : 0}px` },
          pt: '64px',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Box sx={{ maxWidth: '800px', mx: 'auto', my: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
            Create New Shipment
          </Typography>

          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-root .Mui-completed': {
                color: theme.palette.primary.main, 
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: theme.palette.primary.main,
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box>
            {renderStepContent(activeStep)}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 4,
              mb: 2
            }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                sx={{ px: 3 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                sx={{ px: 4 }}
              >
                {activeStep === steps.length - 1 ? "Submit Shipment" : "Next"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};