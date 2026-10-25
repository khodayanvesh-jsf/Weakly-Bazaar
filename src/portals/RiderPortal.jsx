import React, { useState } from 'react';

export default function RiderPortal({ currentUser, orders, setOrders, onLogout }) {
  const [riderOtpInput, setRiderOtpInput] = useState('');

  const dispatchOrders = orders.filter(o => o.status === 'READY_FOR_PICKUP_AGENT_ALERTED' || o.status === 'OUT_FOR_DELIVERY_LIVE_MAP');

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleVerifyOtp = (order, inputOtp) => {
    if (inputOtp === order.secretOtp) {
      handleUpdateStatus(order.id, 'DELIVERED_REVIEW_POPUP');
      setRiderOtpInput('');
      alert('✅ OTP Verified! Delivery Complete. Earnings Added.');
    } else {
      alert('❌ Incorrect Doorstep OTP!');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in text-white pb-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-white">
        <div>
          <h2 className="text-xs font-black text-emerald-400">Delivery & Bike Taxi Radar</h2>
          <p className="text-[10px] text-slate-400">OTP Masked Until Doorstep</p>
        </div>
        <button onClick={onLogout} className="bg-slate-800 text-rose-400 border border-rose-900/50 px-2.5 py-1 rounded-xl text-[9px] font-bold cursor-pointer">
          Exit
        </button>
      </div>

      <div className="space-y-2 text-white">
        {dispatchOrders.length === 0 ? (
          <p className="text-[11px] text-slate-400 py-8 text-center">No active dispatches. Standing by in Adilabad.</p>
        ) : (
          dispatchOrders.map((ord) => (
            <div key={ord.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-[11px] space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-emerald-400">{ord.id}</span>
                <span>{ord.vehicle}</span>
              </div>
              <p className="text-[10px] text-slate-300">Drop: {ord.address}</p>
              
              {ord.status === 'READY_FOR_PICKUP_AGENT_ALERTED' && (
                <button onClick={() => handleUpdateStatus(ord.id, 'OUT_FOR_DELIVERY_LIVE_MAP')} className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer">
                  🎟️ Accept Pickup Token
                </button>
              )}
              {ord.status === 'OUT_FOR_DELIVERY_LIVE_MAP' && (
                <div className="space-y-1.5 pt-1 border-t border-slate-800">
                  <input type="text" placeholder="Enter 4-Digit Doorstep OTP" value={riderOtpInput} onChange={(e) => setRiderOtpInput(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white font-mono outline-none" />
                  <button onClick={() => handleVerifyOtp(ord, riderOtpInput)} className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer">
                    ✓ Verify OTP & Complete Delivery
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}