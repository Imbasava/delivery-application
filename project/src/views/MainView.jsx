import React, { useRef, useEffect, useState } from 'react';
import { Send, Navigation } from 'lucide-react';
import { SmokeEffect } from './components/SmokeEffect';
import { AmbientLight } from './components/AmbientLight';
import { BackgroundTrain } from './components/BackgroundTrain';
import { OptionCard } from './components/OptionCard';
import { useNavigate } from 'react-router-dom';
import traveller from './images/traveller.jpg';
import packing from './images/packing.jpg';
import delivery from './images/delivery.jpg';
import video from './images/video.mp4';

window.addEventListener('beforeunload', function () {
  localStorage.clear();
});


export const MainView = ({
  mouseState,
  velocityFactor,
  moveX,
  moveY,
}) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the Login page
  };

  const handleSenderClick = () => {
    navigate('/sender-details'); // Navigate to the Sender Details page
  };

  const handleTravelerClick = () => {
    navigate('/traveler-details'); // Navigate to the Traveler Details page
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVisible]);

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
      }}
    >
      {/* Smoke and Light Effects */}
      <SmokeEffect mouseState={mouseState} velocityFactor={velocityFactor} />
      <AmbientLight mouseState={mouseState} velocityFactor={velocityFactor} />
      <BackgroundTrain moveX={moveX} moveY={moveY} />

      {/* Login Button */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          className="px-4 py-2 bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-sky-700 transition-all"
          onClick={handleLoginClick}
        >
          Login
        </button>
      </div>

      {/* Main Content */}
      <div 
        className="container mx-auto px-4 pt-32 pb-40 relative z-10"
        style={{ 
          transform: `translate(${-moveX * 0.3}px, ${-moveY * 0.3}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white"
            style={{
              animation: 'fadeIn 1.5s ease-in-out',
            }}
          >
            Deliver While You Travel
          </h1>
          <p 
            className="text-xl md:text-2xl text-sky-200/80 max-w-2xl mx-auto leading-relaxed"
            style={{
              animation: 'fadeIn 2s ease-in-out',
            }}
          >
            Connect with travelers to send your packages.
            <span className="block mt-2">Save time and money while helping others.</span>
          </p>
        </div>

        {/* Option Cards */}
        <div 
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          style={{
            animation: 'fadeInUp 2.5s ease-in-out',
          }}
        >
          <OptionCard
            title="I'm a Traveler"
            description="Earn while you travel by delivering packages along your route"
            Icon={Navigation}
            onClick={handleTravelerClick} // Navigate to Traveler Details page
          />
          <OptionCard
            title="I'm a Sender"
            description="Send your packages with trusted travelers for less"
            Icon={Send}
            onClick={handleSenderClick} // Navigate to Sender Details page
          />
        </div>

        {/* How It Works Section */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            How It Works
          </h2>
          <div className="flex flex-col gap-16 items-center px-4">
            {/* Image 1 */}
            <div className="text-center w-full max-w-6xl group">
              <img 
                src={traveller}
                alt="Choose a Traveler" 
                className="w-full h-[450px] object-cover rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:shadow-3xl"
              />
              <p className="text-white mt-6 text-xl font-medium">
                Choose a traveler heading to your destination.
              </p>
            </div>

            {/* Image 2 */}
            <div className="text-center w-full max-w-6xl group">
              <img 
                src={packing} 
                alt="Send Package" 
                className="w-full h-[450px] object-cover rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:shadow-3xl"
              />
              <p className="text-white mt-6 text-xl font-medium">
                Hand over your package for secure delivery.
              </p>
            </div>

            {/* Image 3 */}
            <div className="text-center w-full max-w-6xl group">
              <img 
                src={delivery}
                alt="Package Delivered" 
                className="w-full h-[450px] object-cover rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:shadow-3xl"
              />
              <p className="text-white mt-6 text-xl font-medium">
                Your package is delivered safely and quickly.
              </p>
            </div>

            {/* Video Section */}
            <div className="mt-24 w-full max-w-6xl mx-auto">
              <video
                ref={videoRef}
                src={video} 
                className={`w-full h-[500px] object-cover rounded-2xl shadow-2xl transition-transform duration-300 ${
                  isVisible ? 'scale-115' : ''
                } ${isHovered ? 'scale-125' : ''}`}
               // muted
                loop
                playsInline
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-4 bg-gray-800 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Deliver While You Travel. All rights reserved.</p>
      </footer>
    </div>
  );
};