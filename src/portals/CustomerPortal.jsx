import React, { useState } from 'react';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, DECORATION_SERVICE_MODULES } from '../data.js';
import { calculateOrderTotals, calculateLogistics } from '../utils/orderMath.js';

export default function CustomerPortal({ currentUser, orders, setOrders, decorBids, setDecorBids, biddingStatus, setBiddingStatus, onLogout }) {
  const [activeCustomerSection, setActiveCustomerSection] = useState('shop'); // 'shop' | 'events' | 'taxi'
  const [selectedCategory, setSelectedCategory] = useState('daily_needs');
  const [cart, setCart] = useState([]);
  const [showCartWindow, setShowCartWindow] = useState(false);

  // --- MAP & TAXI STATE ---
  const [mapModal, setMapModal] = useState({ open: false, addressLabel: 'Collectorate Chowk, Adilabad', distanceKm: 2.2 });
  const [taxiRoute] = useState({ pickup: 'Adilabad Bus Stand', drop: 'RIMS Hospital Gate' });

  // --- DECOR BIDDING STATE ---
  const [decorStep, setDecorStep] = useState('setup'); // 'setup' | 'bidding' | 'escrow_payment'
  const [eventDate, setEventDate] = useState('2026-10-29');
  const [decorCart, setDecorCart] = useState([]);
  const [selectedWinningBid, setSelectedWinningBid] = useState(null);

  const filteredProducts = INITIAL_PRODUCTS.filter((p) => p.categoryId === selectedCategory && p.status === 'approved');

  const handleAddToCart = (product) => {
    const existing = cart.find((i) => i.productId === product.id);
    if (existing) {
      setCart(cart.map((i) => i.productId === product.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { productId: product.id, name: product.subCategoryBrand, price: product.variants[0].price, weightGrams: product.variants[0].weightGrams, qty: 1 }]);
    }
  };

  const handlePlaceOrder = () => {
    const totalWeight = cart.reduce((sum, item) => sum + (item.weightGrams * item.qty), 0);
    const itemsTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const { vehicle, deliveryFee } = calculateLogistics(totalWeight, mapModal.distanceKm);
    const { gst, grandTotal } = calculateOrderTotals(itemsTotal, deliveryFee);
    const secretOtp = String(Math.floor(1000 + Math.random() * 9000));

    const newOrder = {
      id: `WB-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: currentUser.fullName,
      address: mapModal.addressLabel,
      items: cart,
      vehicle,
      itemsTotal,
      heavyTransportFee: 0,
      laborFee: 0,
      deliveryFee,
      gst,
      grandTotal,
      status: 'ORDER_PLACED',
      secretOtp
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setShowCartWindow(false);
    alert(`Order Placed! Your Doorstep Delivery OTP is: ${secretOtp}`);
  };

  return (
    <div className="space-y-4 animate-fade-in text-white pb-6 relative">
      
      {/* Header & Cart */}
      <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-extrabold text-emerald-300">Weekly Bazaar</h2>
          <button onClick={() => setMapModal({ ...mapModal, open: true })} className="text-[10px] text-teal-300 flex items-center gap-1 mt-0.5 cursor-pointer hover:text-white">
            📍 {mapModal.addressLabel.slice(0, 30)}...
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCartWindow(true)} className="bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-2xl text-[11px] font-extrabold shadow cursor-pointer">
            🛒 {cart.reduce((s, i) => s + i.qty, 0)}
          </button>
          <button onClick={onLogout} className="bg-rose-950/50 border border-rose-900 text-rose-400 px-2 rounded-xl text-[10px] font-bold cursor-pointer">Exit</button>
        </div>
      </div>

      {/* Customer Mode Switcher */}
      <div className="grid grid-cols-3 gap-1 text-[11px] bg-slate-900 p-1 rounded-xl">
        <button onClick={() => setActiveCustomerSection('shop')} className={`py-1.5 rounded-lg font-extrabold cursor-pointer transition ${activeCustomerSection === 'shop' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'}`}>🛍️ Stores</button>
        <button onClick={() => { setActiveCustomerSection('events'); setDecorStep('setup'); }} className={`py-1.5 rounded-lg font-extrabold cursor-pointer transition ${activeCustomerSection === 'events' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'}`}>🎉 Decor Bids</button>
        <button onClick={() => setActiveCustomerSection('taxi')} className={`py-1.5 rounded-lg font-extrabold cursor-pointer transition ${activeCustomerSection === 'taxi' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'}`}>🏍️ Taxi</button>
      </div>

      {/* --- 1. SHOP SECTION --- */}
      {activeCustomerSection === 'shop' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {INITIAL_CATEGORIES.filter((c) => c.id !== 'decorations').map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`p-2 rounded-2xl border text-left cursor-pointer transition ${selectedCategory === cat.id ? 'border-emerald-400 bg-emerald-500/15' : 'border-slate-800 bg-slate-900'}`}>
                <img src={cat.image} alt={cat.name} className="w-full h-12 object-cover rounded-xl mb-1.5 opacity-90" />
                <p className="text-[10px] font-extrabold text-white text-center">{cat.name}</p>
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 flex gap-2.5 items-center">
                <img src={prod.image} alt={prod.subCategoryBrand} className="w-14 h-14 rounded-xl object-cover border border-slate-700" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{prod.subCategoryBrand}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-emerald-400 font-bold">₹{prod.variants[0].price} <span className="text-[9px] text-slate-500">/ {prod.variants[0].label}</span></p>
                    <button onClick={() => handleAddToCart(prod)} className="bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer shadow hover:bg-emerald-400">+ Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- 2. EVENTS & REVERSE BIDDING SECTION --- */}
      {activeCustomerSection === 'events' && (
        <div className="space-y-3">
          {decorStep === 'setup' && (
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-emerald-400">📅 Step 1: Event Setup</h3>
              <div>
                <label className="text-[9px] text-slate-400">Event Date</label>
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none focus:border-emerald-500" />
              </div>
              <div className="pt-1 space-y-1.5">
                <h4 className="text-[10px] font-bold text-slate-300">Select Decor Needs:</h4>
                {DECORATION_SERVICE_MODULES.map((mod) => {
                  const inCart = decorCart.some((i) => i.id === mod.id);
                  return (
                    <div key={mod.id} className="bg-slate-950 p-2 rounded-xl flex justify-between items-center border border-slate-800">
                      <div>
                        <p className="text-[11px] font-bold">{mod.title}</p>
                        <p className="text-[9px] text-emerald-400">Est: ₹{mod.baseEstimate}</p>
                      </div>
                      <button onClick={() => setDecorCart(inCart ? decorCart.filter((i) => i.id !== mod.id) : [...decorCart, mod])} className={`px-2.5 py-1 rounded-lg text-[9px] font-bold cursor-pointer ${inCart ? 'bg-rose-600 text-white' : 'bg-emerald-400 text-slate-950'}`}>
                        {inCart ? 'Remove' : '+ Select'}
                      </button>
                    </div>
                  );
                })}
              </div>
              {decorCart.length > 0 && (
                <button onClick={() => { setDecorStep('bidding'); setBiddingStatus('BROADCASTED'); }} className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer shadow">
                  Broadcast to Market Decorators ➔
                </button>
              )}
            </div>
          )}

          {decorStep === 'bidding' && (
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-teal-500/50 space-y-3">
              <h3 className="text-xs font-bold text-teal-300">🌸 Live Reverse-Bidding Window</h3>
              <p className="text-[10px] text-slate-300">Merchants are competing anonymously for your event setup.</p>
              
              <div className="space-y-2">
                {decorBids.length === 0 ? (
                  <p className="text-[10px] text-slate-500 italic py-4 text-center">Waiting for local decorators to submit bids...</p>
                ) : (
                  decorBids.map((b) => (
                    <div key={b.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between font-bold text-xs">
                        <span className="text-white">{b.maskedVendor}</span>
                        <span className="text-emerald-400">₹{b.price}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">{b.features}</p>
                      <button onClick={() => { setSelectedWinningBid(b); setDecorStep('escrow_payment'); }} className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg text-xs cursor-pointer mt-1">
                        ✓ Accept Quote & Pay Escrow
                      </button>
                    </div>
                  ))
                )}
              </div>
              <button onClick={() => setDecorStep('setup')} className="w-full text-center text-[10px] text-slate-400 underline pt-1 cursor-pointer">← Back to Setup</button>
            </div>
          )}

          {decorStep === 'escrow_payment' && selectedWinningBid && (
            <div className="bg-emerald-950/80 border border-emerald-400 p-3.5 rounded-2xl space-y-3">
              <h3 className="font-extrabold text-emerald-300 text-xs">🔐 Secure Escrow Payment</h3>
              <p className="text-[11px] text-slate-200">Winning Bid: <strong>{selectedWinningBid.maskedVendor}</strong></p>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-emerald-500/30">
                <p className="text-[10px] font-bold text-amber-300">Required 35% Escrow Advance: ₹{Math.round((selectedWinningBid.price * 35) / 100)}</p>
              </div>
              <button onClick={() => { setBiddingStatus('PAID'); alert('🎉 Escrow advance locked! Payment success sent to decorator.'); }} className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer shadow">
                Pay via UPI Escrow Now ➔
              </button>
              <button onClick={() => setDecorStep('bidding')} className="w-full text-center text-[10px] text-slate-300 underline cursor-pointer">← Back</button>
            </div>
          )}
        </div>
      )}

      {/* --- 3. TAXI SECTION --- */}
      {activeCustomerSection === 'taxi' && (
        <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-[11px]">
          <h3 className="font-bold text-emerald-400 text-xs">🏍️ Instant Bike Taxi & Parcel</h3>
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-1">
            <p className="text-slate-400"><span className="text-emerald-500 font-bold">A</span> {taxiRoute.pickup}</p>
            <div className="h-4 border-l border-dashed border-slate-600 ml-1.5 my-1"></div>
            <p className="text-slate-400"><span className="text-rose-500 font-bold">B</span> {taxiRoute.drop}</p>
          </div>
          <button onClick={() => alert('🛵 Nearby captain assigned! GPS live tracking active.')} className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer shadow-lg mt-2">
            Book Ride / Dispatch Parcel (₹31)
          </button>
        </div>
      )}

      {/* MODALS */}
      {showCartWindow && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500 rounded-3xl w-full max-w-xs p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-emerald-400 text-sm">🛒 Cart Checkout</h3>
              <button onClick={() => setShowCartWindow(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer">✕</button>
            </div>
            {cart.length === 0 ? <p className="text-slate-400 text-center py-4 text-xs">Your cart is empty.</p> : (
              <>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#0a1922] p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold">{item.name} x{item.qty}</span>
                      <span className="text-[11px] font-black text-white">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
                <button onClick={handlePlaceOrder} className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-2xl cursor-pointer shadow-lg">Proceed to Checkout ➔</button>
              </>
            )}
          </div>
        </div>
      )}

      {mapModal.open && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500 rounded-3xl max-w-sm w-full p-5 space-y-4 text-xs">
            <h3 className="font-bold text-emerald-400 text-sm">🗺️ GPS Coordinates</h3>
            <p className="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">{mapModal.addressLabel}</p>
            <button onClick={() => setMapModal({ ...mapModal, open: false })} className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-2xl cursor-pointer">✓ Confirm Location</button>
          </div>
        </div>
      )}

    </div>
  );
}