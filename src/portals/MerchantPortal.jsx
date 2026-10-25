import React, { useState } from 'react';

export default function MerchantPortal({ currentUser, orders, setOrders, onLogout }) {
  const [merchantTab, setMerchantTab] = useState('orders'); // 'orders' | 'stock' | 'bids'
  const [stockItems, setStockItems] = useState([
    { id: 'st_1', name: 'Amul Taaza Milk (Fresh)', price: 28, unit: '500ml', inStock: true },
    { id: 'st_2', name: 'UltraTech Cement (53 Grade)', price: 380, unit: '50kg Bag', inStock: true }
  ]);
  const [myBidAmount, setMyBidAmount] = useState('');

  const activeOrders = orders.filter(o => o.status !== 'COMPLETED');

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="space-y-4 animate-fade-in text-white pb-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-sm font-black text-emerald-400">🏪 {currentUser.fullName}</h3>
          <p className="text-[10px] text-slate-400">Merchant Desk & Bidding</p>
        </div>
        <button onClick={onLogout} className="bg-rose-950/50 border border-rose-900 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-rose-900 transition">Log Out</button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 text-[10px] bg-[#0a1922] p-1.5 rounded-2xl border border-slate-800">
        <button onClick={() => setMerchantTab('orders')} className={`py-2 rounded-xl font-black transition cursor-pointer ${merchantTab === 'orders' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>📦 Orders</button>
        <button onClick={() => setMerchantTab('stock')} className={`py-2 rounded-xl font-black transition cursor-pointer ${merchantTab === 'stock' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>📋 Stock</button>
        <button onClick={() => setMerchantTab('bids')} className={`py-2 rounded-xl font-black transition cursor-pointer ${merchantTab === 'bids' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>🌸 Bids</button>
      </div>

      {/* ORDERS TAB */}
      {merchantTab === 'orders' && (
        <div className="space-y-3">
          {activeOrders.length === 0 ? (
            <p className="text-[11px] text-slate-400 text-center py-10 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">No active orders right now.<br/>Waiting for customers...</p>
          ) : (
            activeOrders.map(ord => (
              <div key={ord.id} className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700 shadow-lg space-y-2.5">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-emerald-400">Order {ord.id}</span>
                  <span className="text-[10px] font-bold text-slate-300">₹{ord.grandTotal}</span>
                </div>
                <div className="text-[10px] text-slate-300 space-y-1">
                  <p><span className="text-slate-500">To:</span> {ord.customerName}</p>
                  <p><span className="text-slate-500">Items:</span> {ord.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</p>
                  <p><span className="text-slate-500">Status:</span> <span className="text-amber-400 font-bold">{ord.status.replace(/_/g, ' ')}</span></p>
                </div>
                
                {ord.status === 'ORDER_PLACED' && (
                  <button onClick={() => updateOrderStatus(ord.id, 'PACKING_STARTED')} className="w-full bg-amber-500 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer hover:bg-amber-400 transition">✓ Confirm & Start Packing</button>
                )}
                {ord.status === 'PACKING_STARTED' && (
                  <button onClick={() => updateOrderStatus(ord.id, 'READY_FOR_PICKUP')} className="w-full bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer hover:bg-emerald-400 transition">📦 Ready - Alert Rider</button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* STOCK TAB */}
      {merchantTab === 'stock' && (
        <div className="space-y-3">
          {stockItems.map((item, idx) => (
            <div key={item.id} className="bg-slate-900/80 border border-slate-700 p-3.5 rounded-2xl space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-extrabold text-xs text-white">{item.name}</span>
                <button className="text-rose-400 text-[10px] font-bold cursor-pointer hover:text-rose-300">🗑️</button>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center bg-[#03080b] border border-slate-700 rounded-xl px-3 py-2">
                  <span className="text-slate-400 text-xs pr-1">₹</span>
                  <input type="number" value={item.price} onChange={(e) => { const updated = [...stockItems]; updated[idx].price = Number(e.target.value); setStockItems(updated); }} className="w-full bg-transparent text-emerald-300 font-bold text-sm outline-none" />
                </div>
                <button onClick={() => { const updated = [...stockItems]; updated[idx].inStock = !updated[idx].inStock; setStockItems(updated); }} className={`px-4 rounded-xl text-[10px] font-black cursor-pointer transition ${item.inStock ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                  {item.inStock ? '✓ IN STOCK' : '✕ OUT'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BIDS TAB */}
      {merchantTab === 'bids' && (
        <div className="bg-slate-900/80 border border-teal-500/40 p-4 rounded-2xl space-y-3">
          <h3 className="text-xs font-black text-teal-300 flex justify-between">
            <span>🌸 Event Reverse-Bidding</span>
            <span className="bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded text-[9px]">1 Active Lead</span>
          </h3>
          <p className="text-[10px] text-slate-400">Client: "Grand Entrance Arch & Haldi Stage"</p>
          <input type="number" placeholder="Your Bid (₹)" value={myBidAmount} onChange={(e) => setMyBidAmount(e.target.value)} className="w-full bg-[#0a1922] border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-teal-500" />
          <button onClick={() => { alert('Bid Broadcasted! Masked from competitors.'); setMyBidAmount(''); }} className="w-full bg-teal-500 text-slate-950 font-black py-3 rounded-xl text-xs cursor-pointer shadow-lg hover:opacity-90">Submit Anonymous Quote ➔</button>
        </div>
      )}
    </div>
  );
}