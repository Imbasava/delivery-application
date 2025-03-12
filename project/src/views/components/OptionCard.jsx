import React from 'react';

export const OptionCard = ({ title, description, Icon, onClick }) => (
  <button
    className="group relative p-10 glass-morphism rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] hover:shadow-[0_0_70px_rgba(56,189,248,0.3)] transition-all duration-700 border border-sky-500/20"
    onClick={onClick} // Attach the onClick handler
  >
    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="flex flex-col items-center text-center relative z-10">
      <div className="w-24 h-24 glass-morphism rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-1000 border border-sky-500/20">
        <Icon className="w-12 h-12 text-sky-500 group-hover:text-sky-400 transition-colors duration-500" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-sky-400 transition-all duration-500">
        {title}
      </h2>
      <p className="text-lg text-sky-200/80 leading-relaxed">
        {description}
      </p>
    </div>
  </button>
);
