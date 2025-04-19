import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MouseStateModel } from "./models/MouseState";
import { MouseController } from "./controllers/MouseController";
import { MainView } from "./views/MainView";
import { LoginPage } from "./views/loginsign/LoginPage";
import { SignUpPage } from "./views/loginsign/Signup";
import { SenderDetailsPage } from "./views/pages/SenderDetailsPage";
import { TravelerDetailsPage } from "./views/pages/TravelerDetailsPage";
import { ProfilePage } from "./views/pages/ProfilePage";
import ProtectedRoute from "./views/loginsign/ProtectedRoute"; // Import ProtectedRoute
//import { ChooseTravelerPage } from "./views/pages/sender/ChooseTravelerPage";
import { FindTravelersPage } from "./views/pages/sender/FindTravelersPage";
import { TrackItemsPage } from "./views/pages/sender/TrackItemsPage"; 
import { CourierPayment}  from "./views/pages/sender/CourierPayment"; 
import {TravelerChatPage} from "./views/chat/TravelerPage";
import {SenderChatPage} from "./views/chat/SenderPage";



function App() {
  const mouseModel = new MouseStateModel();
  const mouseController = new MouseController(mouseModel);

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/sender-details" element={<SenderDetailsPage />} />
        <Route path="/traveler-details" element={<TravelerDetailsPage />} />
        <Route path="/find-travelers" element={<FindTravelersPage />} />
        <Route path="/track-items" element={<TrackItemsPage />} />
        <Route path="/courier-payment" element={<CourierPayment />} />
        <Route path="/traveler-chat" element={<TravelerChatPage />} />
        <Route path="/sender-chat" element={<SenderChatPage />} />


        {/* Protected Profile Route */}
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
      </Routes>
    </Router>
  );  
}

export default App;
 