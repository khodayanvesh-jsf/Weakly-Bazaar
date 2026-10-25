import React, { useState } from 'react';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data';
import { calculateOrderTotals } from '../utils/orderMath.js';

export default function CustomerPortal({ currentUser, orders, setOrders, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('daily_needs');
  const [surpriseBoxOpen, setSurpriseBoxOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);

  const filteredProducts = INITIAL_PRODUCTS.filter(
    (p) => p.categoryId === selectedCategory && (searchQuery === '' || p.subCategoryBrand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddToCart = (product) => {
    const existing = cart.find((i) => i.productId === product.id);
    if (existing) {
      setCart(cart.map((i) => i.productId === product.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { productId: product.id, name: product.subCategoryBrand, price: product.variants[0].price, qty: 1 }]);
    }
  };

  const totalCartValue = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handlePlaceOrder = () => {
    // Generate order math
    const deliveryFee = 25; // Base Adilabad fee
    const { gst, grandTotal } = calculateOrderTotals(totalCartValue, deliveryFee);
    const secretOtp = String(Math.floor(1000 + Math.random() * 9000)); // Doorstep Code

    const newOrder = {
      id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: currentUser.fullName,
      items: cart,
      itemsTotal: totalCartValue,
      deliveryFee,
      gst,
      grandTotal,
      status: 'ORDER_PLACED',
      secretOtp
    };

    setOrders([newOrder, ...orders]); // Save to global memory!
    setCart([]);
    setShowCartModal(false);
    alert(`Order Placed Successfully! Your Doorstep Delivery OTP is: ${secretOtp}`);
  };

  return (
    <div className="space-y-4 animate-fade-in text-white pb-6">
      <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
        <div><h3 className="text-sm font-black text-emerald-400">Hi, {currentUser.fullName.split(' ')[0]}! 👋</h3><p className="text-[10px] text-slate-400">Adilabad Super-App</p></div>
        <div className="flex gap-2">
          <button onClick={() => setShowCartModal(true)} className="relative bg-slate-800 border border-emerald-500/40 text-emerald-400 px-3 py-2 rounded-xl cursor-pointer">
            🛒 {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{cart.length}</span>}
          </button>
          <button onClick={onLogout} className="bg-rose-950/50 border border-rose-900 text-rose-400 px-2 rounded-xl text-xs font-bold cursor-pointer">Exit</button>
        </div>
      </div>

      <div className="relative group">
        <input type="text" placeholder="Search stores..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#0a1922] border border-slate-700/80 rounded-2xl py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-emerald-500" />
        <span className="absolute left-3.5 top-3.5 text-emerald-500/70 text-sm">🔍</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {INITIAL_CATEGORIES.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`p-2 rounded-2xl border text-left cursor-pointer transition ${selectedCategory === cat.id ? 'border-emerald-400 bg-emerald-500/15' : 'border-slate-800 bg-slate-900/50'}`}>
            <img src={cat.image} alt={cat.name} className="w-full h-14 object-cover rounded-xl mb-1.5 opacity-90" />
            <p className="text-[10px] font-extrabold text-white text-center">{cat.name}</p>
          </button>
        ))}
      </div>
      
      <div className="space-y-2.5 pt-2">
        {filteredProducts.map((prod) => (
          <div key={prod.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-2.5 flex gap-3 items-center">
            <img src={prod.image} className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{prod.subCategoryBrand}</h4>
              <div className="flex justify-between items-center mt-1.5">
                <p className="text-[11px] text-emerald-400 font-black">₹{prod.variants[0].price}</p>
                <button onClick={() => handleAddToCart(prod)} className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-xl text-[10px] font-black cursor-pointer shadow">+ Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCartModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500 rounded-3xl w-full max-w-xs p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-emerald-400 text-sm">🛒 Cart</h3>
              <button onClick={() => setShowCartModal(false)} className="text-slate-400 cursor-pointer">✕</button>
            </div>
            {cart.length === 0 ? <p className="text-slate-400 text-center py-4 text-xs">Cart is empty.</p> : (
              <>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between bg-[#0a1922] p-2.5 rounded-xl border border-slate-800"><span className="text-[10px]">{item.name} x{item.qty}</span><span className="text-[11px] font-black">₹{item.price * item.qty}</span></div>
                  ))}
                </div>
                <button onClick={handlePlaceOrder} className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-2xl cursor-pointer">Checkout (₹{totalCartValue})</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}