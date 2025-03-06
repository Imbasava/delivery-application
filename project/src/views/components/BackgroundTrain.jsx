import React from 'react';
import { Train } from 'lucide-react';

export const BackgroundTrain = ({ moveX, moveY }) => (
  <div 
    className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden"
    style={{ 
      transform: `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`,
      transition: 'transform 0.3s ease-out'
    }}
  >
    <div className="absolute w-full animate-[slide_20s_linear_infinite]">
      <div className="flex items-center gap-4">
        <Train className="w-32 h-32 text-sky-400" />
        <div className="flex gap-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="w-20 h-20 bg-sky-500 rounded-2xl shadow-lg flex items-center justify-center transform rotate-45"
            >
              <div className="w-16 h-16 bg-sky-400 rounded-xl transform -rotate-45" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);