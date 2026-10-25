import React, { useState } from 'react';

export default function RiderPortal({ currentUser, orders, setOrders, onLogout }) {
  const [riderOtpInput, setRiderOtpInput] = useState('');

  // Riders only see orders that are ready or currently out for delivery
  const dispatchOrders = orders.filter(o => o.status === 'READY_FOR_PICKUP' || o.status === 'OUT_FOR_DELIVERY');

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleVerifyOtp = (order, inputOtp) => {
    if (inputOtp === order.secretOtp) {
      handleUpdateStatus(order.id, 'COMPLETED');
      setRiderOtpInput('');
      alert('✅ OTP Verified! Delivery Complete. Earnings Added.');
    } else {
      alert('❌ Incorrect Doorstep OTP!');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in text-white pb-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-sm font-black text-emerald-400">🛵 Captain {currentUser.fullName.split(' ')[0]}</h3>
          <p className="text-[10px] text-slate-400">GPS Radar Active (Adilabad)</p>
        </div>
        <button onClick={onLogout} className="bg-rose-950/50 border border-rose-900 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-rose-900 transition">Log Out</button>
      </div>

      <div className="space-y-3">
        {dispatchOrders.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
            <span className="text-4xl animate-pulse inline-block mb-3">📡</span>
            <p className="text-xs font-bold text-emerald-400">Scanning for Deliveries...</p>
            <p className="text-[10px] text-slate-500 mt-1">Standby in Adilabad Town</p>
          </div>
        ) : (
          dispatchOrders.map(ord => (
            <div key={ord.id} className="bg-slate-900/80 p-4 rounded-3xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-white">Order {ord.id}</span>
                <span className="text-[9px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">EARN ₹{ord.deliveryFee}</span>
              </div>
              <div className="text-[10px] text-slate-300 space-y-1">
                <p><span className="text-slate-500">Pickup From:</span> Local Merchant</p>
                <p><span className="text-slate-500">Drop At:</span> {ord.customerName}</p>
              </div>

              {ord.status === 'READY_FOR_PICKUP' && (
                <button onClick={() => handleUpdateStatus(ord.id, 'OUT_FOR_DELIVERY')} className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-xl text-xs cursor-pointer hover:bg-emerald-400 transition shadow-lg mt-2">
                  🎟️ Accept & Start Navigation
                </button>
              )}
              
              {ord.status === 'OUT_FOR_DELIVERY' && (
                <div className="bg-[#03080b] p-3 rounded-xl border border-amber-500/30 space-y-2 mt-2">
                  <p className="text-[10px] font-bold text-amber-400 text-center">ASK CUSTOMER FOR 4-DIGIT OTP</p>
                  <div className="flex gap-2">
                    <input type="text" maxLength={4} placeholder="••••" value={riderOtpInput} onChange={(e) => setRiderOtpInput(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-lg tracking-[0.3em] font-mono text-white outline-none focus:border-amber-400" />
                    <button onClick={() => handleVerifyOtp(ord, riderOtpInput)} className="bg-amber-500 text-slate-950 font-black px-4 rounded-lg text-xs cursor-pointer hover:bg-amber-400">Verify</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}