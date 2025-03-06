import React from 'react';

export const SmokeEffect = ({ mouseState, velocityFactor }) => (
  <div className="fixed inset-0 overflow-hidden">
    <div 
      className="absolute smoke-effect animate-[pulse_4s_ease-in-out_infinite]"
      style={{
        left: `${mouseState.position.x}%`,
        top: `${mouseState.position.y}%`,
        width: `${600 + velocityFactor * 20}px`,
        height: `${600 + velocityFactor * 20}px`,
        transform: `translate(-50%, -50%) scale(${1 + velocityFactor * 0.05})`,
        background: `
          radial-gradient(circle at center,
            rgba(56, 189, 248, 0.3) 0%,
            rgba(59, 130, 246, 0.2) 20%,
            rgba(147, 51, 234, 0.1) 40%,
            transparent 60%
          )
        `,
        transition: 'width 0.3s ease-out, height 0.3s ease-out'
      }}
    />
    <div 
      className="absolute smoke-effect"
      style={{
        left: `${mouseState.position.x}%`,
        top: `${mouseState.position.y}%`,
        width: `${800 + velocityFactor * 30}px`,
        height: `${800 + velocityFactor * 30}px`,
        transform: `translate(-50%, -50%) scale(${1 + velocityFactor * 0.03})`,
        background: `
          radial-gradient(circle at center,
            rgba(147, 51, 234, 0.2) 0%,
            rgba(56, 189, 248, 0.15) 30%,
            transparent 70%
          )
        `,
        transition: 'width 0.5s ease-out, height 0.5s ease-out'
      }}
    />
  </div>
);