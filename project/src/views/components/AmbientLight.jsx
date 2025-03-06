import React from 'react';

export const AmbientLight = ({ mouseState, velocityFactor }) => (
  <div 
    className="fixed inset-0 opacity-50"
    style={{
      background: `
        radial-gradient(circle at ${mouseState.position.x}% ${mouseState.position.y}%, 
        rgba(147, 51, 234, 0.15) 0%,
        rgba(56, 189, 248, 0.15) 30%,
        transparent 70%)
      `,
      transform: `scale(${1 + velocityFactor * 0.02})`,
      transition: 'transform 0.3s ease-out'
    }}
  />
);