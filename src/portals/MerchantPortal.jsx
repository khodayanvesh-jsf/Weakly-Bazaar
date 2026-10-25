// src/portals/MerchantPortal.jsx
import React from 'react';
import MobilePhoneShell from '../components/MobilePhoneShell';

export default function MerchantPortal({ state, actions }) {
  const {
    currentUser, setActivePortal,
    merchantTab, setMerchantTab,
    orders, stockItems, setStockItems,
    myBidAmount, setMyBidAmount,
    myBidReason, setMyBidReason,
    decorBids, setDecorBids,
    setBiddingStatus
  } = state;

  const {
    handleCreateConcurrentNewOrder,
    handleMerchantConfirmBill,
    handleMerchantDispatchAlert
  } = actions;

  return (
    <MobilePhoneShell title="🏪 WeeklyBazaar Partner" badge="Merchant Desk">
      {/* Top Header & Personal Shopping Shortcut */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <div>
          <h2 className="text-xs font-black text-emerald-400">
            {currentUser?.fullName || 'Sri Laxmi Supermart'}
          </h2>
          <p className="text-[10px] text-slate-400 uppercase">
            Role: {(currentUser?.role || 'merchant').replace('_', ' ')}
          </p>
        </div>
        <button
          onClick={() => setActivePortal('customer')}
          className="bg-slate-800 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-xl text-[9px] font-bold cursor-pointer"
        >
          🛍️ Personal Shop
        </button>
      </div>

      {/* Merchant Portal Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
        <button
          onClick={() => setMerchantTab('orders')}
          className={`py-1.5 rounded-lg font-extrabold transition cursor-pointer ${
            merchantTab === 'orders' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400'
          }`}
        >
          📦 Orders
        </button>
        <button
          onClick={() => setMerchantTab('stock')}
          className={`py-1.5 rounded-lg font-extrabold transition cursor-pointer ${
            merchantTab === 'stock' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400'
          }`}
        >
          📋 Stock / Services
        </button>
        <button
          onClick={() => setMerchantTab('bids')}
          className={`py-1.5 rounded-lg font-extrabold transition cursor-pointer ${
            merchantTab === 'bids' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400'
          }`}
        >
          🌸 Bidding Desk
        </button>
      </div>

      {/* TAB 1: CURRENT ORDERS */}
      {merchantTab === 'orders' && (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-white">Active Customer Orders</h3>
            <button
              onClick={handleCreateConcurrentNewOrder}
              className="bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-xl text-[9px] font-extrabold cursor-pointer"
            >
              + Simulate Incoming Order
            </button>
          </div>

          {orders.length === 0 ? (
            <p className="text-[11px] text-slate-400 text-center py-6">
              No active orders right now. Standing by for customer checkout.
            </p>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-[11px] space-y-2 shadow-sm"
              >
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-400">{ord.id}</span>
                  <span className="text-slate-300">Total: ₹{ord.grandTotal}</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  <strong>Customer:</strong> {ord.customerName} | <strong>Delivery:</strong> {ord.address}
                </p>
                <p className="text-[10px] text-slate-400">
                  {ord.items.map((i) => `${i.name} x${i.qty}`).join(', ')}
                </p>

                {ord.status === 'ORDER_PLACED_MERCHANT_POPUP' && (
                  <div className="space-y-2 pt-1 border-t border-slate-800">
                    <div className="grid grid-cols-2 gap-1.5 text-white">
                      <div>
                        <label className="text-[9px] text-slate-400">Heavy Transport (₹)</label>
                        <input
                          type="number"
                          defaultValue={0}
                          onChange={(e) => (ord.heavyTransportFee = Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400">Labor Fee (₹)</label>
                        <input
                          type="number"
                          defaultValue={0}
                          onChange={(e) => (ord.laborFee = Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1 text-xs"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleMerchantConfirmBill(ord.id, ord.heavyTransportFee, ord.laborFee)}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer"
                    >
                      ✓ Verify Stock & Send Final Bill to Customer
                    </button>
                  </div>
                )}

                {ord.status === 'PAYMENT_DONE_PACKING_STARTED' && (
                  <button
                    onClick={() => handleMerchantDispatchAlert(ord.id)}
                    className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer"
                  >
                    📦 Packed & Ready ➔ Alert Rider
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: ADVANCED STOCK & INVENTORY MANUAL */}
      {merchantTab === 'stock' && (
        <div className="space-y-4 text-white">
          <div>
            <h3 className="text-xs font-bold text-emerald-400">📋 Advanced Stock Management</h3>
            <p className="text-[9px] text-slate-400 mt-0.5">
              Edit prices, delete items, or hide out-of-stock products globally.
            </p>
          </div>

          <div className="space-y-3">
            {stockItems.map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex flex-col gap-2 shadow-sm"
              >
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <span className="font-extrabold text-xs">{item.name}</span>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this product from your shop?')) {
                        setStockItems(stockItems.filter((i) => i.id !== item.id));
                      }
                    }}
                    className="bg-rose-950/50 text-rose-400 border border-rose-800 px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer hover:bg-rose-900"
                  >
                    🗑️ Remove
                  </button>
                </div>

                <div className="flex justify-between items-center gap-3 pt-1">
                  <div className="flex-1 flex items-center bg-[#03080b] border border-slate-700 rounded-lg px-2 py-1">
                    <span className="text-slate-400 text-[10px] pr-1">₹</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => {
                        const updated = [...stockItems];
                        updated[idx].price = Number(e.target.value);
                        setStockItems(updated);
                      }}
                      className="w-full bg-transparent text-emerald-300 font-bold text-xs outline-none"
                    />
                    <span className="text-slate-500 text-[9px] pl-1 border-l border-slate-700 ml-1">
                      / {item.unit}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const updated = [...stockItems];
                      updated[idx].inStock = !updated[idx].inStock;
                      setStockItems(updated);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer transition ${
                      item.inStock
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-600'
                    }`}
                  >
                    {item.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ANONYMOUS DECORATION REVERSE-BIDDING DESK */}
      {merchantTab === 'bids' && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white">🌸 Live Event Reverse-Bidding Desk</h3>
          <p className="text-[10px] text-slate-400">
            Submit competitive Indian Rupee bids and pricing justifications. Identities remain masked until the 35% advance escrow is paid.
          </p>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-300">Active Request: Royal Wedding Setup</span>
              <span className="text-emerald-400">Est Budget: ₹25,000</span>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">
                BID AMOUNT (INR CURRENCY - NUMERIC ONLY)
              </label>
              <input
                type="number"
                placeholder="e.g. 21500"
                value={myBidAmount}
                onChange={(e) => setMyBidAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">
                PRICING RATIONALE / INCLUSIONS
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Includes welcome flower arch and 4 LED warm spotlights..."
                value={myBidReason}
                onChange={(e) => setMyBidReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!myBidAmount || isNaN(myBidAmount)) {
                  alert('Please enter a valid numeric value for your bid.');
                  return;
                }
                setDecorBids([
                  ...decorBids,
                  {
                    id: `bid_${Date.now()}`,
                    maskedVendor: 'Verified Partner (You)',
                    price: Number(myBidAmount),
                    features: myBidReason || 'Standard package inclusions'
                  }
                ]);
                setBiddingStatus('BROADCASTED');
                alert('✅ Competitive bid broadcasted anonymously to consumer!');
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2 rounded-xl text-xs shadow cursor-pointer"
            >
              Submit Anonymous Bid ➔
            </button>
          </div>
        </div>
      )}
    </MobilePhoneShell>
  );
}