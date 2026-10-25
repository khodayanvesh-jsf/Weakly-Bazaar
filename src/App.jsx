import React, { useState } from 'react';
import MobilePhoneShell from './components/MobilePhoneShell';
import AuthGateway from './portals/AuthGateway';
import CustomerPortal from './portals/CustomerPortal';
import MerchantPortal from './portals/MerchantPortal';
import RiderPortal from './portals/RiderPortal';
import AdminDashboard from './portals/AdminDashboard';

// ============================================================================
// MASTER APP LOGIC
// ============================================================================
function AppContent() {
  // GLOBAL MEMORY
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]); 
  
  // EVENT BIDDING MEMORY
  const [decorBids, setDecorBids] = useState([]);
  const [biddingStatus, setBiddingStatus] = useState('IDLE');
  
  // VIEW MANAGER (Here is the missing variable!)
  const [viewMode, setViewMode] = useState('mobile'); 
  const [onboardingStep, setOnboardingStep] = useState('permissions'); 

  const handleLoginSuccess = (user) => {
    if (user.fullName.toLowerCase() === 'admin') {
      setViewMode('admin');
    } else {
      setCurrentUser(user);
      setOnboardingStep('app');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOnboardingStep('auth');
    setViewMode('mobile');
  };

  // --- 1. Permissions Gateway ---
  const renderPermissionsScreen = () => (
    <div className="flex flex-col justify-between h-full py-2 space-y-4 text-white px-2">
      <div className="text-center space-y-1.5 pt-2">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 mx-auto flex items-center justify-center text-3xl shadow-lg">🌿</div>
        <h1 className="text-lg font-extrabold">Peace-of-Mind Permissions</h1>
        <p className="text-[11px] text-slate-300">Grant permissions to connect with local stores and bike captains.</p>
      </div>
      <div className="space-y-2.5">
        {['Location', 'Notifications', 'Camera', 'Storage'].map((p, idx) => (
          <div key={idx} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold">{p} Access</span>
            <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-full">✓ Allowed</span>
          </div>
        ))}
      </div>
      <button onClick={() => setOnboardingStep('auth')} className="w-full bg-emerald-400 text-slate-950 font-extrabold py-3 rounded-2xl text-xs cursor-pointer">
        Continue to Login / Sign Up ➔
      </button>
    </div>
  );

  // --- 2. Active Portal Router ---
  const renderMobilePortal = () => {
    if (onboardingStep === 'permissions') return renderPermissionsScreen();
    if (onboardingStep === 'auth') return <AuthGateway onLoginSuccess={handleLoginSuccess} />;
    
    switch (currentUser?.role) {
      case 'customer':
        return <CustomerPortal currentUser={currentUser} orders={orders} setOrders={setOrders} decorBids={decorBids} setDecorBids={setDecorBids} biddingStatus={biddingStatus} setBiddingStatus={setBiddingStatus} onLogout={handleLogout} />;
      case 'merchant':
        return <MerchantPortal currentUser={currentUser} orders={orders} setOrders={setOrders} decorBids={decorBids} setDecorBids={setDecorBids} biddingStatus={biddingStatus} setBiddingStatus={setBiddingStatus} onLogout={handleLogout} />;
      case 'delivery_agent':
        return <RiderPortal currentUser={currentUser} orders={orders} setOrders={setOrders} onLogout={handleLogout} />;
      default:
        return <div className="text-center p-5 text-white">🚧 Portal Under Construction</div>;
    }
  };

  if (viewMode === 'admin') {
    return <AdminDashboard orders={orders} setViewMode={setViewMode} onLogout={handleLogout} />;
  }

  // EXACT OLD PREMIUM LOOK (No ugly floating text)
  return (
    <div className="min-h-screen bg-[#03080b] flex flex-col items-center justify-center font-sans py-6">
      <MobilePhoneShell 
        title={onboardingStep === 'permissions' ? "VocalForLocal • Setup" : "VocalForLocal"} 
        badge={currentUser ? currentUser.role.toUpperCase() : (onboardingStep === 'permissions' ? "Step 1 of 2" : "Security Vault")}
      >
        {renderMobilePortal()}
      </MobilePhoneShell>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}