import React from 'react';

export default function MobilePhoneShell({ title, badge, children }) {
  return (
    <div className="w-full max-w-[405px] mx-auto bg-[#071318] border-[7px] border-slate-800/90 rounded-[44px] shadow-[0_25px_70px_-15px_rgba(16,185,129,0.28)] overflow-hidden flex flex-col min-h-[800px] max-h-[850px] relative">
      
      {/* Premium Frosted Glass Header */}
      <div className="sticky top-0 z-40 bg-[#071318]/80 backdrop-blur-md border-b border-emerald-500/20 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2.5">
          {/* New "WB" Weekly Bazaar Logo */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)] border border-emerald-300/50">
            <span className="text-white font-black text-[11px] tracking-tighter">WB</span>
          </div>
          <div>
            <h2 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-100 tracking-wide">{title}</h2>
            <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">{badge}</p>
          </div>
        </div>
      </div>
      
      {/* Scrollable Content Viewport */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-gradient-to-b from-[#071318] via-[#09181F] to-[#050E12] hide-scroll">
        {children}
      </div>
      
      {/* Bottom Gesture Bar */}
      <div className="bg-[#040B0E] py-2.5 flex justify-center border-t border-emerald-950/60">
        <div className="w-28 h-1 bg-slate-700 rounded-full" />
      </div>

    </div>
  );
}
