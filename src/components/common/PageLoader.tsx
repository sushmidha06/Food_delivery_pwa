import React from 'react';

export const PageLoader: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
      className="min-h-[70vh] w-full flex flex-col items-center justify-center p-6"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="w-16 h-16 rounded-full border-4 border-brand-100 border-t-brand-500 animate-spin" />
        
        {/* Inner pulsing brand dot */}
        <div className="absolute w-6 h-6 rounded-full bg-brand-500/20 animate-ping" />
        <div className="absolute w-3 h-3 rounded-full bg-brand-500" />
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm font-semibold text-slate-700 tracking-wide">
          Loading Zestora...
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          Preparing delicious experiences for you
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
