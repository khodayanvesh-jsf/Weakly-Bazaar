import React, { useState } from 'react';

export default function AdminDashboard({ orders, setViewMode, onLogout }) {
  const [founderTab, setFounderTab] = useState('flow_tester'); // 'flow_tester' | 'database' | 'approvals'
  
  return (
    <div className="min-h-screen bg-[#040c10] text-slate-100 flex flex-col font-sans w-full absolute inset-0 z-50">
      <header className="bg-slate-900 border-b border-emerald-950 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-xl">🌿</div>
          <div>
            <h1 className="text-base font-extrabold text-white">Founder Control Suite</h1>
            <p className="text-xs text-slate-400">Master Admin Dashboard</p>
          </div>
        </div>
        <button onClick={onLogout} className="bg-rose-900 text-rose-300 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">Close Admin</button>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="space-y-2">
          {[
            { id: 'flow_tester', label: '🔄 Screen Flow Tester' },
            { id: 'database', label: '🗄️ Master Database Editor' },
            { id: 'approvals', label: '🛡️ Approvals & KYC' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setFounderTab(tab.id)} className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition border cursor-pointer ${founderTab === tab.id ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}>
              {tab.label}
            </button>
          ))}
        </aside>

        <main className="lg:col-span-3 space-y-6">
          {founderTab === 'flow_tester' && (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 space-y-4 text-xs">
              <h2 className="text-base font-extrabold text-emerald-400">🔄 1-Click Screen-by-Screen Flow Tester</h2>
              <p className="text-slate-300">Instantly jump to any operational screen in the mobile app without manual navigation (Return to mobile mode first).</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button onClick={() => setViewMode('mobile')} className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 cursor-pointer text-emerald-300 font-bold">1. Permissions Gateway</button>
                <button onClick={() => setViewMode('mobile')} className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 cursor-pointer text-emerald-300 font-bold">2. Auth & Page 1</button>
                <button onClick={() => setViewMode('mobile')} className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 cursor-pointer text-emerald-300 font-bold">4. Customer Store Hub</button>
                <button onClick={() => setViewMode('mobile')} className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 cursor-pointer text-emerald-300 font-bold">5. Decor Bidding</button>
              </div>
            </div>
          )}

          {founderTab === 'database' && (
            <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-5 text-xs">
              <h2 className="text-base font-extrabold text-amber-400">🗄️ Master Global Orders Database</h2>
              <table className="w-full text-left bg-slate-950 border border-slate-800 rounded-xl">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[9px]">
                  <tr><th className="p-3">Order ID</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {orders.length === 0 ? (
                    <tr><td colSpan="4" className="p-3 text-center text-slate-500">No orders yet.</td></tr>
                  ) : (
                    orders.map(o => (
                      <tr key={o.id} className="text-[10px] text-white">
                        <td className="p-3 text-emerald-400">{o.id}</td><td className="p-3">{o.customerName}</td><td className="p-3">₹{o.grandTotal}</td><td className="p-3">{o.status}</td>
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