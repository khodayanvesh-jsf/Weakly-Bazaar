// src/portals/RiderPortal.jsx
import React from 'react';
import MobilePhoneShell from '../components/MobilePhoneShell';

export default function RiderPortal({ state, actions }) {
  const { orders, riderOtpInput, setRiderOtpInput, setActivePortal } = state;
  const { handleRiderAcceptPickupToken, handleVerifyDeliveryOtp } = actions;

  return (
    <MobilePhoneShell title="🛵 WeeklyBazaar Captain" badge="GPS Live">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-white">
        <div>
          <h2 className="text-xs font-black text-emerald-400">Delivery & Bike Taxi Radar</h2>
          <p className="text-[10px] text-slate-400">OTP Masked Until Doorstep</p>
        </div>
        <button
          onClick={() => setActivePortal('customer')}
          className="bg-slate-800 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-xl text-[9px] font-bold cursor-pointer"
        >
          🛍️ Personal Shop
        </button>
      </div>

      <div className="space-y-2 text-white">
        {orders.length === 0 ? (
          <p className="text-[11px] text-slate-400 py-8 text-center">
            No active dispatches. Standing by in Adilabad.
          </p>
        ) : (
          orders.map((ord) => (
            <div key={ord.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-[11px] space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-emerald-400">{ord.id}</span>
                <span>{ord.vehicle}</span>
              </div>
              <p className="text-[10px] text-slate-300">Drop: {ord.address}</p>
              <p className="text-[9px] text-amber-300">Status: {ord.status.replace(/_/g, ' ')}</p>

              {ord.status === 'READY_FOR_PICKUP_AGENT_ALERTED' && (
                <button
                  onClick={() => handleRiderAcceptPickupToken(ord.id)}
                  className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer"
                >
                  🎟️ Accept Pickup Token
                </button>
              )}

              {ord.status === 'OUT_FOR_DELIVERY_LIVE_MAP' && (
                <div className="space-y-1.5 pt-1 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder={`Enter 4-Digit Doorstep OTP (Hint: ${ord.secretOtp})`}
                    value={riderOtpInput}
                    onChange={(e) => setRiderOtpInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white font-mono"
                  />
                  <button
                    onClick={() => handleVerifyDeliveryOtp(ord.id)}
                    className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer"
                  >
                    ✓ Verify OTP & Complete Delivery
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </MobilePhoneShell>
  );
}