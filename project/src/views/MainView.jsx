import React from 'react';
import { Send, Navigation } from 'lucide-react';
import { SmokeEffect } from './components/SmokeEffect';
import { AmbientLight } from './components/AmbientLight';
import { BackgroundTrain } from './components/BackgroundTrain';
import { OptionCard } from './components/OptionCard';
import { useNavigate } from 'react-router-dom';

export const MainView = ({
  mouseState,
  velocityFactor,
  moveX,
  moveY
}) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the Login page
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0f172a, #1e293b)'
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
          onClick={handleLoginClick} // Navigate to the Login page
        >
          Login
        </button>
      </div>

      {/* Main Content */}
      <div 
        className="container mx-auto px-4 pt-32 pb-40 relative z-10"
        style={{ 
          transform: `translate(${-moveX * 0.3}px, ${-moveY * 0.3}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
            Deliver While You Travel
          </h1>
          <p className="text-xl md:text-2xl text-sky-200/80 max-w-2xl mx-auto leading-relaxed">
            Connect with travelers to send your packages.
            <span className="block mt-2">Save time and money while helping others.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <OptionCard
            title="I'm a Traveler"
            description="Earn while you travel by delivering packages along your route"
            Icon={Navigation}
          />
          <OptionCard
            title="I'm a Sender"
            description="Send your packages with trusted travelers for less"
            Icon={Send}
          />
        </div>
      </div>
    </div>
  );
};
