// src/components/MobilePhoneShell.jsx
import React from 'react';

export default function MobilePhoneShell({ title, badge, children }) {
  return (
    <div className="w-full max-w-[405px] mx-auto bg-[#071318] border-[7px] border-slate-800/90 rounded-[44px] shadow-[0_25px_70px_-15px_rgba(16,185,129,0.28)] overflow-hidden flex flex-col min-h-[800px] max-h-[850px] relative">
      {/* Top Status Bezel */}
      <div className="bg-[#040B0E] px-5 py-2.5 flex justify-between items-center text-[10px] text-slate-300 border-b border-emerald-950/80 select-none">
        <span className="font-extrabold text-emerald-400 tracking-wide flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {title}
        </span>
        <div className="w-16 h-3.5 bg-slate-900 rounded-full border border-slate-800" />
        <span className="text-teal-300 font-semibold">{badge}</span>
      </div>

      {/* Scrollable Screen Viewport */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-gradient-to-b from-[#071318] via-[#09181F] to-[#050E12] text-white">
        {children}
      </div>

      {/* Bottom Home Indicator */}
      <div className="bg-[#040B0E] py-2.5 flex justify-center border-t border-emerald-950/60">
        <div className="w-28 h-1 bg-slate-700 rounded-full" />
      </div>
    </div>
  );
}