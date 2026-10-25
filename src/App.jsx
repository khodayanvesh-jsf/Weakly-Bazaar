import React, { useState } from 'react';
import MobilePhoneShell from './components/MobilePhoneShell';
import AuthGateway from './portals/AuthGateway';
import CustomerPortal from './portals/CustomerPortal';
import MerchantPortal from './portals/MerchantPortal';
import RiderPortal from './portals/RiderPortal';
import AdminDashboard from './portals/AdminDashboard'; // <-- NEW

export default function App() {
  // GLOBAL MEMORY
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]); 
  
  // VIEW MANAGER ('mobile', 'admin', 'simulator')
  const [viewMode, setViewMode] = useState('mobile'); 

  // --- Handlers ---
  const handleLoginSuccess = (user) => {
    // Secret Backdoor: If user types "admin" as name, open Dashboard!
    if (user.fullName.toLowerCase() === 'admin') {
      setViewMode('admin');
    } else {
      setCurrentUser(user);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewMode('mobile');
  };

  // --- 1. Standard Mobile View ---
  const renderMobilePortal = () => {
    if (!currentUser) return <AuthGateway onLoginSuccess={handleLoginSuccess} />;
    
    switch (currentUser.role) {
      case 'customer':
        return <CustomerPortal currentUser={currentUser} orders={orders} setOrders={setOrders} onLogout={handleLogout} />;
      case 'merchant':
        return <MerchantPortal currentUser={currentUser} orders={orders} setOrders={setOrders} onLogout={handleLogout} />;
      case 'delivery_agent':
        return <RiderPortal currentUser={currentUser} orders={orders} setOrders={setOrders} onLogout={handleLogout} />;
      default:
        return <div className="text-center p-5 text-white">🚧 Under Construction</div>;
    }
  };

  // --- 2. Live Split-Screen Simulator View ---
  // This mocks 3 logged-in users so you can test the pipeline instantly!
  if (viewMode === 'simulator') {
    return (
      <div className="min-h-screen bg-[#020507] p-6 font-sans">
        <div className="flex justify-between items-center mb-6 bg-slate-900 border border-emerald-500/30 p-4 rounded-2xl shadow-lg">
          <div>
            <h2 className="text-emerald-400 font-black text-xl flex items-center gap-2"><span className="animate-pulse">🔴</span> LIVE SIMULATOR</h2>
            <p className="text-slate-400 text-xs">Watch the data sync across all 3 portals instantly.</p>
          </div>
          <button onClick={() => setViewMode('admin')} className="bg-rose-950 border border-rose-500 text-rose-400 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer hover:bg-rose-900">
            Exit Simulator
          </button>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-8 snap-x hide-scroll">
          {/* Mock Customer Phone */}
          <div className="min-w-[405px] snap-center">
            <MobilePhoneShell title="CUSTOMER" badge="SHOPPER">
              <CustomerPortal currentUser={{ fullName: 'Test Shopper', role: 'customer' }} orders={orders} setOrders={setOrders} onLogout={() => alert('Disabled in Simulator')} />
            </MobilePhoneShell>
          </div>

          {/* Mock Merchant Phone */}
          <div className="min-w-[405px] snap-center">
            <MobilePhoneShell title="MERCHANT" badge="STORE OWNER">
              <MerchantPortal currentUser={{ fullName: 'Test Shop', role: 'merchant' }} orders={orders} setOrders={setOrders} onLogout={() => alert('Disabled in Simulator')} />
            </MobilePhoneShell>
          </div>

          {/* Mock Rider Phone */}
          <div className="min-w-[405px] snap-center">
            <MobilePhoneShell title="RIDER" badge="CAPTAIN">
              <RiderPortal currentUser={{ fullName: 'Test Captain', role: 'delivery_agent' }} orders={orders} setOrders={setOrders} onLogout={() => alert('Disabled in Simulator')} />
            </MobilePhoneShell>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. Desktop Admin Dashboard View ---
  if (viewMode === 'admin') {
    return <AdminDashboard orders={orders} onLaunchSimulator={() => setViewMode('simulator')} onLogout={handleLogout} />;
  }

  // --- Default: Wrap standard mobile view in the Phone Shell ---
  return (
    <div className="min-h-screen bg-[#03080b] flex flex-col items-center justify-center p-4 font-sans">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 tracking-wider">WEEKLY BAZAAR</h1>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Hint: Register with name "admin" to open Dashboard</p>
      </div>
      
      <MobilePhoneShell title="WEEKLY BAZAAR" badge={currentUser ? currentUser.role.toUpperCase() : "SECURE LOGIN"}>
        {renderMobilePortal()}
      </MobilePhoneShell>
    </div>
  );
}