import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MouseStateModel } from './models/MouseState';
import { MouseController } from './controllers/MouseController';
import { MainView } from './views/MainView';
import { LoginPage } from './views/loginsign/LoginPage';
import { SignUpPage } from './views/loginsign/Signup/';

// Inside <Routes>


function App() {
  const mouseModel = new MouseStateModel();
  const mouseController = new MouseController(mouseModel);

  // Setup mouse event listeners
  useEffect(() => {
    const cleanup = mouseController.setupEventListeners();
    return () => cleanup();
  }, [mouseController]);

  const mouseState = mouseModel.getState();
  const velocityFactor = mouseModel.getVelocityFactor();
  const moveX = mouseModel.getMoveX();
  const moveY = mouseModel.getMoveY();

  return (
    <Router>
      <Routes>
        {/* Route for MainView */}
        <Route
          path="/"
          element={
            <MainView
              mouseState={mouseState}
              velocityFactor={velocityFactor}
              moveX={moveX}
              moveY={moveY}
            />
          }
        />
        {/* Route for LoginPage */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

      </Routes>
    </Router>
  );
}

export default App;
