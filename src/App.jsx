// src/App.jsx
import React, { useState } from 'react';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_FUNCTION_HALLS
} from './data';
import { calculateLogistics, calculateOrderTotals } from './utils/orderMath';
import AuthGateway from './portals/AuthGateway';
import CustomerPortal from './portals/CustomerPortal';
import MerchantPortal from './portals/MerchantPortal';
import RiderPortal from './portals/RiderPortal';
import AdminDashboard from './portals/AdminDashboard';

function AppContent() {
  const isDirectAdminUrl =
    typeof window !== 'undefined' && window.location.search.includes('admin');

  // View & Navigation State
  const [viewMode, setViewMode] = useState(isDirectAdminUrl ? 'founder_web' : 'mobile_app');
  const [founderTab, setFounderTab] = useState('testing');

  // Registration & Device Lock State
  const savedDeviceUser =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('vfl_device_registered_user') || 'null')
      : null;
  const [hasRegisteredOnDevice, setHasRegisteredOnDevice] = useState(!!savedDeviceUser);
  const [onboardingStep, setOnboardingStep] = useState('auth'); // 'permissions' | 'auth' | 'app'
  const [authStage, setAuthStage] = useState(savedDeviceUser ? 'fast_login' : 'landing');
  const [selectedRole, setSelectedRole] = useState(savedDeviceUser?.role || 'customer');

  // Simulated Database Registry
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const localDb =
      typeof window !== 'undefined' ? localStorage.getItem('vfl_registered_users_db') : null;
    if (localDb) return JSON.parse(localDb);
    return [
      {
        id: 'usr_demo',
        fullName: 'Khoday Anvesh',
        username: 'anvesh_k',
        phone: '9848011223',
        govId: '[Redacted]',
        role: 'customer',
        passwordHash: 'Adilabad@2026',
        fastPin: '1990',
        selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      }
    ];
  });

  const [regForm, setRegForm] = useState({
    fullName: '',
    username: '',
    phone: '',
    otpInput: '',
    generatedOtp: '',
    otpVerified: false,
    govId: '',
    selfieUrl: '',
    password: '',
    confirmPassword: '',
    fastPin: ''
  });
  const [loginForm, setLoginForm] = useState({ usernameOrPhone: '', password: '', pinInput: '' });
  const [authError, setAuthError] = useState('');
  const [currentUser, setCurrentUser] = useState(savedDeviceUser || registeredUsers[0]);

  // Active Portals & Discovery
  const [activePortal, setActivePortal] = useState('customer'); // 'customer' | 'merchant' | 'rider' | 'split'
  const [searchQuery, setSearchQuery] = useState('');
  const [surpriseBoxOpen, setSurpriseBoxOpen] = useState(false);

  // Master Data & Commission Sliders
  const [categories] = useState(INITIAL_CATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [functionHalls] = useState(INITIAL_FUNCTION_HALLS);
  const [merchantCommissionPct, setMerchantCommissionPct] = useState(0);
  const [consumerFeePct, setConsumerFeePct] = useState(0);

  // Category Carts
  const [selectedCategory, setSelectedCategory] = useState('daily_needs');
  const [activeCustomerSection, setActiveCustomerSection] = useState('shop');
  const [selectedVariantMap, setSelectedVariantMap] = useState({});
  const [categoryCarts, setCategoryCarts] = useState({ daily_needs: [], construction: [], medicines: [] });
  const [showCartWindow, setShowCartWindow] = useState(false);

  // GPS Map & Taxi Route State
  const [mapModal, setMapModal] = useState({
    open: false,
    mode: 'consumer_pin',
    lat: 19.6641,
    lng: 78.532,
    addressLabel: 'Collectorate Chowk, Adilabad (19.6641° N, 78.5320° E)',
    distanceKm: 2.2
  });
  const [taxiRoute, setTaxiRoute] = useState({
    pickup: 'Adilabad Bus Stand (19.6668° N, 78.5310° E)',
    drop: 'RIMS Hospital Gate (19.6580° N, 78.5250° E)',
    distanceKm: 3.4,
    mode: '2w_taxi'
  });

  // Active Orders & Dispatch Queue
  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [riderOtpInput, setRiderOtpInput] = useState('');

  // Multi-Phone Simulator & Admin Database State
  const [splitScreens, setSplitScreens] = useState([
    { id: 'phone_1', role: 'customer' },
    { id: 'phone_2', role: 'merchant' },
    { id: 'phone_3', role: 'service_provider' },
    { id: 'phone_4', role: 'delivery_agent' }
  ]);
  const [adminDbTab, setAdminDbTab] = useState('users');
  const [editingRecord, setEditingRecord] = useState(null);

  // Event Decoration & Reverse-Bidding State
  const [decorStep, setDecorStep] = useState('setup');
  const [eventDate, setEventDate] = useState('2026-10-29');
  const [eventTime, setEventTime] = useState('18:00');
  const [venueType, setVenueType] = useState('Function Hall / Open Lawn');
  const [venueAddress, setVenueAddress] = useState('Vidya Nagar Colony, Adilabad');
  const [decorCart, setDecorCart] = useState([]);
  const [decorBids, setDecorBids] = useState([]);
  const [biddingStatus, setBiddingStatus] = useState('IDLE');
  const [selectedWinningBid, setSelectedWinningBid] = useState(null);
  const [hallBookingState, setHallBookingState] = useState(null);

  // Approvals & Stock Manual
  const [pendingMerchants, setPendingMerchants] = useState([
    { id: 'pm_1', businessName: 'Balaji Steel & Cement Traders', phone: '9848011223', categoryId: 'construction', eSigned: true, status: 'pending' }
  ]);
  const [pendingSubCategories] = useState([
    { id: 'ps_1', subCategoryBrand: 'Amul Taaza Homogenised Milk' }
  ]);
  const [merchantTab, setMerchantTab] = useState('orders');
  const [stockItems, setStockItems] = useState([
    { id: 'st_1', name: 'Swastick Turmeric Powder', category: 'daily_needs', price: 50, unit: '250gms', inStock: true },
    { id: 'st_2', name: 'Swastick Turmeric Powder', category: 'daily_needs', price: 100, unit: '500gms', inStock: true },
    { id: 'st_3', name: 'Amul Fresh Milk', category: 'daily_needs', price: 28, unit: '500ml', inStock: false }
  ]);
  const [myBidAmount, setMyBidAmount] = useState('');
  const [myBidReason, setMyBidReason] = useState('');

  // Event Math
  const getDaysUntilEvent = () => {
    const today = new Date('2026-10-25T00:00:00');
    const selected = new Date(`${eventDate}T00:00:00`);
    return Math.max(Math.ceil((selected - today) / (1000 * 60 * 60 * 24)), 1);
  };
  const advancePercentage = getDaysUntilEvent() >= 5 ? 35 : 85;

  // --- ACTIONS ---
  const validatePasswordStrength = (pw) => pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);

  const handleSendRegistrationOtp = () => {
    if (!/^\d{10}$/.test(regForm.phone)) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    const testOtp = String(Math.floor(100000 + Math.random() * 900000));
    setRegForm((prev) => ({ ...prev, generatedOtp: testOtp, otpInput: testOtp }));
    setAuthError('');
    alert(`🔐 WeeklyBazaar Security OTP: ${testOtp}\n(Auto-filled for fast testing)`);
  };

  const handleVerifyRegistrationOtp = () => {
    if (!regForm.otpInput || regForm.otpInput !== regForm.generatedOtp) {
      setAuthError('Invalid OTP! Please enter the exact 6-digit code received.');
      return;
    }
    setRegForm((prev) => ({ ...prev, otpVerified: true }));
    setAuthError('');
    setAuthStage('signup_step2');
  };

  const handleCaptureSelfie = (e) => {
    const file = e.target.files?.[0];
    if (file) setRegForm((prev) => ({ ...prev, selfieUrl: URL.createObjectURL(file) }));
  };

  const handleCompleteIdentityStep = () => {
    if (!regForm.fullName.trim() || !regForm.username.trim()) {
      setAuthError('Please fill in your Full Legal Name and Username.');
      return;
    }
    const cleanedGovId = regForm.govId.replace(/\s+/g, '');
    if (cleanedGovId.length !== 12) {
      setAuthError('Please enter a valid 12-character ID proof.');
      return;
    }
    setAuthError('');
    setAuthStage('signup_step3');
  };

  const handleFinalizeRegistration = () => {
    if (!validatePasswordStrength(regForm.password)) {
      setAuthError('Password must be at least 8 characters, with 1 uppercase letter and 1 number.');
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (!/^\d{4}$/.test(regForm.fastPin)) {
      setAuthError('Please enter a 4-digit quick access PIN.');
      return;
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      fullName: regForm.fullName.trim(),
      username: regForm.username.trim(),
      phone: regForm.phone.trim(),
      govId: '[Verified]',
      role: selectedRole,
      passwordHash: regForm.password,
      fastPin: regForm.fastPin,
      selfieUrl: regForm.selfieUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    };

    const updatedDb = [...registeredUsers, newUser];
    setRegisteredUsers(updatedDb);
    localStorage.setItem('vfl_registered_users_db', JSON.stringify(updatedDb));
    localStorage.setItem('vfl_device_registered_user', JSON.stringify(newUser));
    setHasRegisteredOnDevice(true);
    setCurrentUser(newUser);
    setOnboardingStep('app');
    setActivePortal(selectedRole === 'customer' ? 'customer' : selectedRole === 'delivery_agent' ? 'rider' : 'merchant');
  };

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    const query = loginForm.usernameOrPhone.trim().toLowerCase();
    if (query === 'admin') {
      setViewMode('founder_web');
      return;
    }
    const matchedUser = registeredUsers.find(
      (u) => u.username.toLowerCase() === query || u.phone === query
    );
    if (!matchedUser || matchedUser.passwordHash !== loginForm.password) {
      setAuthError('Invalid credentials. (Try username: anvesh_k / pass: Adilabad@2026)');
      return;
    }
    const updatedUser = { ...matchedUser, role: selectedRole };
    setCurrentUser(updatedUser);
    localStorage.setItem('vfl_device_registered_user', JSON.stringify(updatedUser));
    setHasRegisteredOnDevice(true);
    setAuthError('');
    setOnboardingStep('app');
    setActivePortal(selectedRole === 'customer' ? 'customer' : selectedRole === 'delivery_agent' ? 'rider' : 'merchant');
  };

  const handlePinLogin = (e) => {
    e.preventDefault();
    const targetUser = currentUser || savedDeviceUser || registeredUsers[0];
    if (loginForm.pinInput !== targetUser.fastPin && loginForm.pinInput !== '1990') {
      setAuthError('Incorrect 4-Digit PIN. (Demo PIN: 1990)');
      return;
    }
    setCurrentUser(targetUser);
    setAuthError('');
    setOnboardingStep('app');
    setActivePortal(targetUser.role === 'customer' ? 'customer' : targetUser.role === 'delivery_agent' ? 'rider' : 'merchant');
  };

  const handleLogout = () => {
    setOnboardingStep('auth');
    setAuthStage('fast_login');
  };

  const handleAddToCart = (product) => {
    const chosenVariantId = selectedVariantMap[product.id] || product.variants[0].id;
    const variant = product.variants.find((v) => v.id === chosenVariantId) || product.variants[0];
    const currentCart = categoryCarts[product.categoryId] || [];
    const existing = currentCart.find((i) => i.productId === product.id && i.variantId === variant.id);
    let updated;
    if (existing) {
      updated = currentCart.map((i) =>
        i.productId === product.id && i.variantId === variant.id ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      updated = [
        ...currentCart,
        {
          productId: product.id,
          variantId: variant.id,
          name: `${product.subCategoryBrand} (${variant.label})`,
          shopName: product.shopName,
          price: variant.price,
          mrp: variant.mrp || variant.price + 15,
          weightGrams: variant.weightGrams,
          image: product.image,
          qty: 1
        }
      ];
    }
    setCategoryCarts({ ...categoryCarts, [product.categoryId]: updated });
  };

  const handleUpdateCartQty = (catId, productId, variantId, delta) => {
    const currentCart = categoryCarts[catId] || [];
    const updated = currentCart
      .map((i) => (i.productId === productId && i.variantId === variantId ? { ...i, qty: i.qty + delta } : i))
      .filter((i) => i.qty > 0);
    setCategoryCarts({ ...categoryCarts, [catId]: updated });
  };

  const handlePlaceCategoryOrder = (catId) => {
    const currentCart = categoryCarts[catId] || [];
    if (currentCart.length === 0) return;
    const totalWeightGrams = currentCart.reduce((s, i) => s + i.weightGrams * i.qty, 0);
    const itemsTotal = currentCart.reduce((s, i) => s + i.price * i.qty, 0);
    const { vehicle, deliveryFee } = calculateLogistics(totalWeightGrams, mapModal.distanceKm, 0, 0);
    const { gst, grandTotal } = calculateOrderTotals(itemsTotal, deliveryFee);
    const secretOtp = String(Math.floor(1000 + Math.random() * 9000));

    const newOrder = {
      id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
      categoryId: catId,
      categoryName: categories.find((c) => c.id === catId)?.name || 'Town Order',
      customerName: currentUser?.fullName || 'Khoday Anvesh',
      address: mapModal.addressLabel,
      distanceKm: mapModal.distanceKm,
      items: currentCart,
      totalWeightGrams,
      vehicle,
      itemsTotal,
      heavyTransportFee: 0,
      laborFee: 0,
      deliveryFee,
      gst,
      grandTotal,
      status: 'ORDER_PLACED_MERCHANT_POPUP',
      tokenHandedOver: false,
      secretOtp
    };
    setOrders([newOrder, ...orders]);
    setActiveOrderId(newOrder.id);
    setCategoryCarts({ ...categoryCarts, [catId]: [] });
    setShowCartWindow(false);
  };

  const handleCreateConcurrentNewOrder = () => {
    const sampleItem = products[0];
    const v = sampleItem.variants[0];
    const secretOtp = String(Math.floor(1000 + Math.random() * 9000));
    const newOrd = {
      id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
      categoryId: 'daily_needs',
      categoryName: 'Daily Home Needs',
      customerName: `Neighbor #${orders.length + 1}`,
      address: 'Vidya Nagar, Adilabad',
      distanceKm: 1.5,
      items: [
        {
          productId: sampleItem.id,
          variantId: v.id,
          name: `${sampleItem.subCategoryBrand} (${v.label})`,
          price: v.price,
          weightGrams: v.weightGrams,
          qty: 1
        }
      ],
      totalWeightGrams: v.weightGrams,
      vehicle: '2-Wheeler Rider',
      itemsTotal: v.price,
      heavyTransportFee: 0,
      laborFee: 0,
      deliveryFee: 25,
      gst: 5,
      grandTotal: v.price + 30,
      status: 'ORDER_PLACED_MERCHANT_POPUP',
      tokenHandedOver: false,
      secretOtp
    };
    setOrders([newOrd, ...orders]);
    setActiveOrderId(newOrd.id);
  };

  const handleMerchantConfirmBill = (orderId, heavyFee = 0, laborCost = 0) => {
    setOrders(
      orders.map((o) => {
        if (o.id !== orderId) return o;
        const extra = Number(heavyFee || 0) + Number(laborCost || 0);
        return {
          ...o,
          heavyTransportFee: Number(heavyFee || 0),
          laborFee: Number(laborCost || 0),
          grandTotal: o.grandTotal + extra,
          status: 'MERCHANT_CONFIRMED_WAIT_PAYMENT'
        };
      })
    );
  };

  const handleCustomerPayOrder = (orderId) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: 'PAYMENT_DONE_PACKING_STARTED' } : o)));
  };

  const handleMerchantDispatchAlert = (orderId) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: 'READY_FOR_PICKUP_AGENT_ALERTED' } : o)));
  };

  const handleRiderAcceptPickupToken = (orderId) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: 'OUT_FOR_DELIVERY_LIVE_MAP', tokenHandedOver: true } : o
      )
    );
  };

  const handleVerifyDeliveryOtp = (orderId) => {
    const target = orders.find((o) => o.id === orderId);
    if (target && riderOtpInput.trim() === target.secretOtp) {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: 'DELIVERED_REVIEW_POPUP' } : o)));
      setRiderOtpInput('');
      alert('✅ Delivery Verified! Escrow settled to Merchant & Captain wallet.');
    } else {
      alert('Incorrect 4-digit doorstep OTP!');
    }
  };

  // Bundle State & Actions for clean modular passing
  const state = {
    viewMode, setViewMode, founderTab, setFounderTab,
    hasRegisteredOnDevice, onboardingStep, setOnboardingStep,
    authStage, setAuthStage, selectedRole, setSelectedRole,
    registeredUsers, setRegisteredUsers, regForm, setRegForm,
    loginForm, setLoginForm, authError, currentUser, savedDeviceUser,
    activePortal, setActivePortal, searchQuery, setSearchQuery,
    surpriseBoxOpen, setSurpriseBoxOpen, categories, products, setProducts,
    functionHalls, merchantCommissionPct, setMerchantCommissionPct,
    consumerFeePct, setConsumerFeePct, selectedCategory, setSelectedCategory,
    activeCustomerSection, setActiveCustomerSection, selectedVariantMap, setSelectedVariantMap,
    categoryCarts, showCartWindow, setShowCartWindow, mapModal, setMapModal,
    taxiRoute, setTaxiRoute, orders, activeOrderId, riderOtpInput, setRiderOtpInput,
    splitScreens, setSplitScreens, adminDbTab, setAdminDbTab, editingRecord, setEditingRecord,
    decorStep, setDecorStep, eventDate, setEventDate, eventTime, setEventTime,
    venueType, setVenueType, venueAddress, setVenueAddress, decorCart, setDecorCart,
    decorBids, setDecorBids, biddingStatus, setBiddingStatus,
    selectedWinningBid, setSelectedWinningBid, hallBookingState, setHallBookingState,
    pendingMerchants, setPendingMerchants, pendingSubCategories,
    merchantTab, setMerchantTab, stockItems, setStockItems,
    myBidAmount, setMyBidAmount, myBidReason, setMyBidReason, advancePercentage
  };

  const actions = {
    handleSendRegistrationOtp, handleVerifyRegistrationOtp, handleCaptureSelfie,
    handleCompleteIdentityStep, handleFinalizeRegistration, handlePasswordLogin,
    handlePinLogin, handleLogout, handleAddToCart, handleUpdateCartQty,
    handlePlaceCategoryOrder, handleCreateConcurrentNewOrder, handleMerchantConfirmBill,
    handleCustomerPayOrder, handleMerchantDispatchAlert, handleRiderAcceptPickupToken,
    handleVerifyDeliveryOtp
  };

  return (
    <div className="min-h-screen bg-[#03080b] text-white flex flex-col font-sans">
      {/* Top Control Bar (Quick Role Switcher + Founder Desk) */}
      <nav className="w-full bg-slate-900 border-b border-emerald-500/40 px-4 py-2.5 flex flex-wrap justify-between items-center sticky top-0 z-50 shadow-lg text-xs gap-2">
        <div className="flex items-center gap-2">
          <span className="font-black text-emerald-300 tracking-wide">🌿 WEEKLY BAZAAR • VOCALFORLOCAL</span>
          {viewMode === 'mobile_app' && onboardingStep === 'app' && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 ml-3">
              <button
                onClick={() => setActivePortal('customer')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                  activePortal === 'customer' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                🛍️ Customer
              </button>
              <button
                onClick={() => setActivePortal('merchant')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                  activePortal === 'merchant' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                🏪 Merchant
              </button>
              <button
                onClick={() => setActivePortal('rider')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                  activePortal === 'rider' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                🛵 Captain
              </button>
              <button
                onClick={() => setActivePortal('split')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                  activePortal === 'split' ? 'bg-amber-400 text-slate-950' : 'text-amber-300'
                }`}
              >
                📱 Split-View
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'mobile_app' ? (
            <button
              onClick={() => {
                setFounderTab('testing');
                setViewMode('founder_web');
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl cursor-pointer shadow"
            >
              💻 Founder Desk
            </button>
          ) : (
            <button
              onClick={() => setViewMode('mobile_app')}
              className="bg-teal-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl cursor-pointer shadow"
            >
              📱 Back to App
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Router */}
      {viewMode === 'founder_web' ? (
        <div className="flex-1 w-full">
          <AdminDashboard state={state} actions={actions} />
        </div>
      ) : (
        <main className="flex-1 p-4 flex flex-col justify-center items-center">
          {(onboardingStep === 'permissions' || onboardingStep === 'auth') && (
            <AuthGateway state={state} actions={actions} />
          )}

          {onboardingStep === 'app' && (
            <>
              {activePortal === 'customer' && <CustomerPortal state={state} actions={actions} />}
              {activePortal === 'merchant' && <MerchantPortal state={state} actions={actions} />}
              {activePortal === 'rider' && <RiderPortal state={state} actions={actions} />}

              {/* Multi-Phone Split Screen Simulator */}
              {activePortal === 'split' && (
                <div className="w-full flex overflow-x-auto gap-6 pb-6 pt-6 px-4 snap-x snap-mandatory">
                  {splitScreens.map((phone, idx) => (
                    <div key={phone.id} className="min-w-[405px] flex-shrink-0 snap-center relative">
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black z-50 whitespace-nowrap shadow">
                        PHONE {idx + 1}: {phone.role.toUpperCase()}
                      </div>
                      {phone.role === 'customer' && <CustomerPortal state={state} actions={actions} />}
                      {(phone.role === 'merchant' || phone.role === 'service_provider') && (
                        <MerchantPortal state={state} actions={actions} />
                      )}
                      {phone.role === 'delivery_agent' && <RiderPortal state={state} actions={actions} />}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      )}

      {/* Google Maps Modal */}
      {mapModal.open && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs">
            <h3 className="font-bold text-emerald-400">🗺️ GPS Coordinates Confirmed</h3>
            <p className="text-slate-300">{mapModal.addressLabel}</p>
            <button
              onClick={() => setMapModal({ ...mapModal, open: false })}
              className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-2xl cursor-pointer"
            >
              ✓ Confirm Location
            </button>
          </div>
        </div>
      )}

      {/* JSON Database Editor Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500 rounded-3xl w-full max-w-2xl p-5 space-y-4 flex flex-col">
            <h3 className="font-extrabold text-amber-400 text-sm">🗄️ Master Database Editor</h3>
            <textarea
              value={editingRecord.jsonStr}
              onChange={(e) => setEditingRecord({ ...editingRecord, jsonStr: e.target.value })}
              className="h-64 bg-[#03080b] text-emerald-300 font-mono text-[11px] p-3 rounded-xl border border-slate-700 outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setEditingRecord(null)}
                className="flex-1 bg-slate-800 py-2.5 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  try {
                    const data = JSON.parse(editingRecord.jsonStr);
                    if (editingRecord.type === 'users') {
                      const a = [...registeredUsers];
                      a[editingRecord.index] = data;
                      setRegisteredUsers(a);
                    } else {
                      const a = [...products];
                      a[editingRecord.index] = data;
                      setProducts(a);
                    }
                    setEditingRecord(null);
                    alert('✅ Saved');
                  } catch (e) {
                    alert('❌ Invalid JSON');
                  }
                }}
                className="flex-1 bg-amber-500 text-slate-950 py-2.5 rounded-xl font-black cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Global Error Boundary (Prevents Blank Screens)
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('WeeklyBazaar App Crashed:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#071318] flex flex-col items-center justify-center p-4 font-sans text-white">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl w-full max-w-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-black text-rose-400 mb-2">⚠️ Application Crashed!</h2>
            <div className="bg-[#03080b] rounded-xl p-4 border border-rose-900/50 mb-3 overflow-x-auto">
              <p className="text-[11px] font-bold text-rose-300 mb-1">Error Message:</p>
              <p className="text-xs font-mono text-rose-100">{this.state.error?.toString()}</p>
            </div>
            <div className="bg-[#03080b] rounded-xl p-4 border border-slate-800 overflow-x-auto">
              <pre className="text-[10px] text-slate-400 font-mono whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack || this.state.error?.stack}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-3 rounded-xl cursor-pointer"
            >
              🔄 Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AppContent />
    </GlobalErrorBoundary>
  );
}