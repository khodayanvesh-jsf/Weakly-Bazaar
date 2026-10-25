import React, { useState } from 'react';

export default function AdminDashboard({ orders, onLaunchSimulator, onLogout }) {
  const [adminTab, setAdminTab] = useState('overview');

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.grandTotal, 0);
  const totalPlatformFee = orders.reduce((sum, ord) => sum + ord.gst, 0); // Mocking GST as platform fee for now

  return (
    <div className="min-h-screen bg-[#040c10] text-slate-100 flex flex-col font-sans w-full absolute inset-0 z-50">
      
      {/* Admin Top Navbar */}
      <header className="bg-slate-900 border-b border-emerald-950 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(16,185,129,0.4)]">🌿</div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-wide">Weekly Bazaar Control Suite</h1>
            <p className="text-xs text-emerald-400">Adilabad Master Root Access</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onLaunchSimulator} className="bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs cursor-pointer shadow-lg hover:bg-amber-400 transition flex items-center gap-2">
            <span className="text-lg">📱</span> Launch Split-Screen Simulator
          </button>
          <button onClick={onLogout} className="bg-slate-800 border border-rose-900/50 text-rose-400 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer hover:bg-slate-700 transition">
            Close Desktop
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar */}
        <aside className="space-y-2">
          <button onClick={() => setAdminTab('overview')} className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition border cursor-pointer ${adminTab === 'overview' ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'}`}>
            📊 Live Ecosystem Stats
          </button>
          <button onClick={() => setAdminTab('orders')} className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition border cursor-pointer ${adminTab === 'orders' ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'}`}>
            📦 Global Order Database
          </button>
        </aside>

        {/* Content Area */}
        <main className="md:col-span-3 space-y-6">
          
          {adminTab === 'overview' && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Orders Today</h3>
                <p className="text-4xl font-black text-white mt-2">{orders.length}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Platform Escrow</h3>
                <p className="text-4xl font-black text-emerald-400 mt-2">₹{totalRevenue.toFixed(2)}</p>
                <p className="text-[10px] text-teal-300 mt-1">Platform Cut: ₹{totalPlatformFee.toFixed(2)}</p>
              </div>
            </div>
          )}

          {adminTab === 'orders' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg animate-fade-in">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="p-4 font-bold">Order ID</th>
                    <th className="p-4 font-bold">Customer</th>
                    <th className="p-4 font-bold">Amount</th>
                    <th className="p-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {orders.length === 0 ? (
                    <tr><td colSpan="4" className="p-6 text-center text-slate-500">No orders in database.</td></tr>
                  ) : (
                    orders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-mono text-emerald-400">{o.id}</td>
                        <td className="p-4 text-white font-bold">{o.customerName}</td>
                        <td className="p-4 text-slate-300">₹{o.grandTotal}</td>
                        <td className="p-4">
                          <span className="bg-slate-800 text-amber-300 px-2.5 py-1 rounded-lg font-bold text-[10px]">{o.status.replace(/_/g, ' ')}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
