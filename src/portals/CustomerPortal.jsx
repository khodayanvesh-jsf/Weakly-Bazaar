// src/portals/CustomerPortal.jsx
import React from 'react';
import MobilePhoneShell from '../components/MobilePhoneShell';
import { DECORATION_SERVICE_MODULES } from '../data';

export default function CustomerPortal({ state, actions }) {
  const {
    categories, products, functionHalls,
    selectedCategory, setSelectedCategory,
    activeCustomerSection, setActiveCustomerSection,
    selectedVariantMap, setSelectedVariantMap,
    categoryCarts, showCartWindow, setShowCartWindow,
    searchQuery, setSearchQuery,
    surpriseBoxOpen, setSurpriseBoxOpen,
    mapModal, setMapModal,
    taxiRoute, setTaxiRoute,
    orders,
    decorStep, setDecorStep,
    eventDate, setEventDate,
    eventTime, setEventTime,
    venueType, setVenueType,
    venueAddress, setVenueAddress,
    decorCart, setDecorCart,
    decorBids, setDecorBids,
    setBiddingStatus,
    selectedWinningBid, setSelectedWinningBid,
    hallBookingState, setHallBookingState,
    advancePercentage
  } = state;

  const {
    handleAddToCart,
    handleUpdateCartQty,
    handlePlaceCategoryOrder,
    handleCustomerPayOrder,
    handleLogout
  } = actions;

  const currentCart = categoryCarts[selectedCategory] || [];
  const approvedProducts = products.filter(
    (p) =>
      p.categoryId === selectedCategory &&
      p.status === 'approved' &&
      (searchQuery === '' || p.subCategoryBrand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeCustomerOrder = orders[0] || null;

  return (
    <MobilePhoneShell title="🌿 WeeklyBazaar • VFL" badge="Peace-of-Mind Hub">
      {/* Top Bar */}
      <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-extrabold text-emerald-300">Weekly Bazaar • Adilabad</h2>
          <button
            onClick={() => setMapModal({ ...mapModal, open: true })}
            className="text-[10px] text-teal-300 flex items-center gap-1 mt-0.5 cursor-pointer hover:underline"
          >
            📍 {mapModal.addressLabel.slice(0, 32)}...
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowCartWindow(true)}
            className="bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-2xl text-[11px] font-extrabold shadow cursor-pointer"
          >
            🛒 {currentCart.reduce((s, i) => s + i.qty, 0)}
          </button>
          <button
            onClick={handleLogout}
            className="bg-slate-800 text-slate-300 px-2 py-1.5 rounded-xl text-[9px] font-bold border border-slate-700 cursor-pointer"
          >
            Lock
          </button>
        </div>
      </div>

      {/* Live Order Status Tracker (If an order is active) */}
      {activeCustomerOrder && (
        <div className="bg-emerald-950/90 border border-emerald-400/60 rounded-2xl p-2.5 text-[11px] space-y-1.5 shadow-md">
          <div className="flex justify-between items-center font-bold">
            <span className="text-emerald-300">📦 Order {activeCustomerOrder.id}</span>
            <span className="text-[9px] bg-slate-900 px-2 py-0.5 rounded-full text-amber-300">
              {activeCustomerOrder.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-[10px] text-slate-200">
            Total: <strong>₹{activeCustomerOrder.grandTotal}</strong> | Doorstep OTP:{' '}
            <strong className="font-mono text-emerald-300">{activeCustomerOrder.secretOtp}</strong>
          </p>
          {activeCustomerOrder.status === 'MERCHANT_CONFIRMED_WAIT_PAYMENT' && (
            <button
              onClick={() => handleCustomerPayOrder(activeCustomerOrder.id)}
              className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer shadow"
            >
              💳 Pay Final Bill (₹{activeCustomerOrder.grandTotal}) Now ➔
            </button>
          )}
        </div>
      )}

      {/* Mode Switcher */}
      <div className="grid grid-cols-4 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
        <button
          onClick={() => setActiveCustomerSection('shop')}
          className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
            activeCustomerSection === 'shop' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
          }`}
        >
          🛍️ Stores
        </button>
        <button
          onClick={() => {
            setActiveCustomerSection('events');
            setDecorStep('setup');
          }}
          className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
            activeCustomerSection === 'events' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
          }`}
        >
          🎉 Decor
        </button>
        <button
          onClick={() => setActiveCustomerSection('halls')}
          className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
            activeCustomerSection === 'halls' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
          }`}
        >
          🏛️ Halls
        </button>
        <button
          onClick={() => setActiveCustomerSection('taxi')}
          className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
            activeCustomerSection === 'taxi' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
          }`}
        >
          🏍️ Taxi
        </button>
      </div>

      {/* [07A] HYPERLOCAL STORE CATALOG & CURIOSITY BOX */}
      {activeCustomerSection === 'shop' && (
        <div className="space-y-3">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="🔍 Search local Adilabad stores & items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
          />

          {/* Curiosity Secret Deal Box */}
          <div
            onClick={() => setSurpriseBoxOpen(!surpriseBoxOpen)}
            className="bg-gradient-to-r from-emerald-900/80 to-teal-900/80 border border-emerald-400/40 rounded-2xl p-2.5 flex justify-between items-center cursor-pointer"
          >
            <div>
              <p className="text-[11px] font-black text-emerald-300">🎁 Adilabad Curiosity Deal Box</p>
              <p className="text-[10px] text-slate-200">
                {surpriseBoxOpen
                  ? '🔥 Pure Forest Honey 250g @ ₹99 (Save ₹51 today!)'
                  : 'Tap to reveal today’s hyperlocal town flash deal'}
              </p>
            </div>
            <span className="text-xl">{surpriseBoxOpen ? '🍯' : '✨'}</span>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-3 gap-2">
            {categories
              .filter((c) => c.id !== 'decorations')
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-2 rounded-2xl border text-left transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'border-emerald-400 bg-emerald-500/15'
                      : 'border-slate-800 bg-slate-900'
                  }`}
                >
                  <img src={cat.image} alt={cat.name} className="w-full h-10 object-cover rounded-xl mb-1" />
                  <p className="text-[10px] font-extrabold text-white truncate">{cat.name}</p>
                </button>
              ))}
          </div>

          {/* Approved Products List */}
          <div className="space-y-2">
            {approvedProducts.map((prod) => {
              const chosenVarId = selectedVariantMap[prod.id] || prod.variants[0].id;
              const activeVar = prod.variants.find((v) => v.id === chosenVarId) || prod.variants[0];
              return (
                <div
                  key={prod.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 flex gap-2.5 items-center"
                >
                  <img src={prod.image} alt={prod.subCategoryBrand} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-white truncate">{prod.subCategoryBrand}</h4>
                      <span className="text-[9px] text-amber-400 font-bold">★ {prod.rating}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 truncate">
                      🏪 {prod.shopName} • {prod.distanceKm} km
                    </p>
                    <div className="flex items-center justify-between mt-1.5 gap-2">
                      <select
                        value={chosenVarId}
                        onChange={(e) => setSelectedVariantMap({ ...selectedVariantMap, [prod.id]: e.target.value })}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-1.5 py-0.5 text-[10px] text-emerald-300 font-bold outline-none"
                      >
                        {prod.variants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.label} - ₹{v.price}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAddToCart(prod)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer"
                      >
                        + Add (₹{activeVar.price})
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* [07B] FUNCTION HALL DIRECT TRANSPARENT BOOKING */}
      {activeCustomerSection === 'halls' && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-emerald-400">🏛️ Direct Function Hall Booking (Zero Broker)</h3>
          {functionHalls.map((fh) => (
            <div key={fh.id} className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-1.5 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-white">{fh.name}</span>
                <span className="text-emerald-400">₹{fh.pricePerDay}/day</span>
              </div>
              <p className="text-[10px] text-slate-400">
                📍 {fh.area} • Capacity: {fh.capacity} Guests • {fh.acIncluded ? '❄️ AC Hall' : '🌳 Open Lawn'}
              </p>
              <button
                onClick={() => {
                  setHallBookingState(fh.id);
                  alert(`✅ ${fh.name} reserved for ${eventDate}!`);
                }}
                className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl text-[11px] cursor-pointer"
              >
                {hallBookingState === fh.id ? '✓ Reserved for Event' : 'Book Function Hall Direct ➔'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* [07C] MULTI-PAGE EVENT DECORATION & REVERSE-BIDDING SUITE */}
      {activeCustomerSection === 'events' && (
        <div className="space-y-3">
          {/* PAGE A: EVENT SETUP */}
          {decorStep === 'setup' && (
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-emerald-400">📅 Step 1: Event Date, Time & Venue</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[9px] text-slate-400">Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400">Time</label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9px] text-slate-400">Venue Type</label>
                <select
                  value={venueType}
                  onChange={(e) => setVenueType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-xs text-white"
                >
                  <option value="Function Hall / Open Lawn">Function Hall / Open Lawn</option>
                  <option value="Home / Residential Rooftop">Home / Residential Rooftop</option>
                  <option value="Community Mandapam">Community Mandapam</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] text-slate-400">Venue Address & GPS Location</label>
                <input
                  type="text"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-xs text-white"
                />
              </div>
              <div className="pt-1">
                <h4 className="text-[10px] font-bold text-slate-300 mb-1.5">Select Decor Modules:</h4>
                {DECORATION_SERVICE_MODULES.map((mod) => {
                  const inCart = decorCart.some((i) => i.id === mod.id);
                  return (
                    <div
                      key={mod.id}
                      className="bg-slate-950 p-2 rounded-xl mb-1.5 flex justify-between items-center border border-slate-800"
                    >
                      <div>
                        <p className="text-[11px] font-bold">{mod.title}</p>
                        <p className="text-[9px] text-emerald-400">Est: ₹{mod.baseEstimate}</p>
                      </div>
                      <button
                        onClick={() =>
                          setDecorCart(inCart ? decorCart.filter((i) => i.id !== mod.id) : [...decorCart, mod])
                        }
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold cursor-pointer ${
                          inCart ? 'bg-rose-600 text-white' : 'bg-emerald-400 text-slate-950'
                        }`}
                      >
                        {inCart ? 'Remove' : '+ Select'}
                      </button>
                    </div>
                  );
                })}
              </div>
              {decorCart.length > 0 && (
                <button
                  onClick={() => {
                    setDecorStep('bidding');
                    setBiddingStatus('BROADCASTED');
                    if (decorBids.length === 0) {
                      setDecorBids([
                        { id: 'b1', maskedVendor: 'Decorator Partner #A1', price: 21500, features: 'Floral arch + warm LED spotlights' },
                        { id: 'b2', maskedVendor: 'Decorator Partner #B2', price: 19800, features: 'Stage setup + grand entrance gate' }
                      ]);
                    }
                  }}
                  className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer shadow"
                >
                  Broadcast to Market Decorators & Start Bidding ➔
                </button>
              )}
            </div>
          )}

          {/* PAGE B: LIVE REVERSE-BIDDING WINDOW */}
          {decorStep === 'bidding' && (
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-teal-500/50 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-teal-300">🌸 Live Reverse-Bidding Window</h3>
                <span className="text-[9px] bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-full">
                  Zero Bias
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                Merchants are competing anonymously for your event setup. Review quotes below:
              </p>

              <div className="space-y-2">
                {decorBids.map((b) => (
                  <div key={b.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold text-xs">
                      <span className="text-white">{b.maskedVendor}</span>
                      <span className="text-emerald-400">₹{b.price}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{b.features}</p>
                    <button
                      onClick={() => {
                        setSelectedWinningBid(b);
                        setDecorStep('escrow_payment');
                      }}
                      className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg text-xs cursor-pointer mt-1"
                    >
                      ✓ Accept This Quote & Proceed to Escrow
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() =>
                  alert('🔄 Broadcast extended to more Adilabad decorators! New competing bids will appear shortly.')
                }
                className="w-full bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40 font-bold py-2 rounded-xl text-xs cursor-pointer"
              >
                🔄 Require More Bids from Market (Lower Rates)
              </button>
              <button
                onClick={() => setDecorStep('setup')}
                className="w-full text-center text-[10px] text-slate-400 underline pt-1 cursor-pointer"
              >
                ← Back to Event Setup
              </button>
            </div>
          )}

          {/* PAGE C: ESCROW PAYMENT */}
          {decorStep === 'escrow_payment' && selectedWinningBid && (
            <div className="bg-emerald-950/80 border border-emerald-400 p-3.5 rounded-2xl space-y-3 text-xs">
              <h3 className="font-extrabold text-emerald-300">🔐 Secure Escrow Payment & Confirmation</h3>
              <p className="text-[11px] text-slate-200">
                Winning Bid: <strong>{selectedWinningBid.maskedVendor}</strong> — ₹{selectedWinningBid.price}
              </p>
              <div className="bg-slate-900 p-2.5 rounded-xl space-y-1 border border-emerald-500/30">
                <p className="text-[10px] font-bold text-amber-300">
                  Required {advancePercentage}% Escrow Advance: ₹
                  {Math.round((selectedWinningBid.price * advancePercentage) / 100)}
                </p>
                <p className="text-[9px] text-slate-400">
                  Balance {100 - advancePercentage}% due 5 hours before event setup.
                </p>
              </div>
              <button
                onClick={() => {
                  setBiddingStatus('PAID');
                  alert(
                    '🎉 Escrow advance locked! Full-screen confirmation sent to decorator and payment success sent to consumer.'
                  );
                }}
                className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
              >
                Pay ₹{Math.round((selectedWinningBid.price * advancePercentage) / 100)} via UPI Escrow Now ➔
              </button>
              <button
                onClick={() => setDecorStep('bidding')}
                className="w-full text-center text-[10px] text-slate-300 underline cursor-pointer"
              >
                ← Return to Bidding Window
              </button>
            </div>
          )}
        </div>
      )}

      {/* [07D] BIKE TAXI, 3W AUTO & PARCEL */}
      {activeCustomerSection === 'taxi' && (
        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5 text-[11px]">
          <h3 className="font-bold text-emerald-400">🏍️ Instant Bike Taxi, 3W Auto & Parcel</h3>
          <div className="space-y-1.5">
            <input
              type="text"
              value={taxiRoute.pickup}
              onChange={(e) => setTaxiRoute({ ...taxiRoute, pickup: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-[10px] text-white"
            />
            <input
              type="text"
              value={taxiRoute.drop}
              onChange={(e) => setTaxiRoute({ ...taxiRoute, drop: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-[10px] text-white"
            />
          </div>
          <button
            onClick={() => alert('🛵 Nearby captain assigned! GPS live tracking active.')}
            className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer shadow"
          >
            Book Ride / Dispatch Parcel (₹31)
          </button>
        </div>
      )}

      {/* ISOLATED CATEGORY CART MODAL */}
      {showCartWindow && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-emerald-400">🛒 Cart Checkout</h3>
              <button onClick={() => setShowCartWindow(false)} className="bg-slate-800 px-2 py-0.5 rounded cursor-pointer">
                ✕
              </button>
            </div>
            {currentCart.length === 0 ? (
              <p className="text-slate-400 text-center py-4">Your cart is empty.</p>
            ) : (
              <>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {currentCart.map((i) => (
                    <div
                      key={`${i.productId}_${i.variantId}`}
                      className="flex justify-between items-center bg-slate-800 p-2 rounded-xl"
                    >
                      <span className="truncate pr-2">
                        {i.name} (₹{i.price})
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateCartQty(selectedCategory, i.productId, i.variantId, -1)}
                          className="bg-slate-700 px-2 py-0.5 rounded font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-bold">{i.qty}</span>
                        <button
                          onClick={() => handleUpdateCartQty(selectedCategory, i.productId, i.variantId, 1)}
                          className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handlePlaceCategoryOrder(selectedCategory)}
                  className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-2xl cursor-pointer shadow"
                >
                  Send Order to Local Store (3-Min SLA) ➔
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </MobilePhoneShell>
  );
}