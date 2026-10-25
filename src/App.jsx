import React, { useState, useEffect } from 'react';
import MobilePhoneShell from './components/MobilePhoneShell';
import AuthGateway from './portals/AuthGateway';
import CustomerPortal from './portals/CustomerPortal';
import MerchantPortal from './portals/MerchantPortal';
import RiderPortal from './portals/RiderPortal';
import AdminDashboard from './portals/AdminDashboard';

// ============================================================================
// GLOBAL ERROR BOUNDARY (CATCHES CRASHES & PREVENTS BLANK SCREENS)
// ============================================================================
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
    console.error("Weekly Bazaar App Crashed:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#071318] flex flex-col items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl w-full max-w-2xl p-6 shadow-2xl shadow-rose-900/50">
            <h2 className="text-xl font-black text-rose-400 mb-2">⚠️ Application Crashed!</h2>
            <div className="bg-[#03080b] rounded-xl p-4 border border-rose-900/50 mb-3 overflow-x-auto">
              <p className="text-[11px] font-bold text-rose-300 mb-1">Error Message:</p>
              <p className="text-xs font-mono text-rose-100">{this.state.error?.toString()}</p>
            </div>
            <button onClick={() => window.location.reload()} className="mt-5 w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-3 rounded-xl shadow-lg cursor-pointer">
              🔄 Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// MASTER APP LOGIC
// ============================================================================
function AppContent() {
  // GLOBAL MEMORY
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]); 
  
  // EVENT BIDDING MEMORY (Shared between Customer & Merchant)
  const [decorBids, setDecorBids] = useState([]);
  const [biddingStatus, setBiddingStatus] = useState('IDLE'); // 'IDLE' | 'BROADCASTED' | 'PAID'
  
  // VIEW MANAGER
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile', 'admin', 'simulator'
  const [onboardingStep, setOnboardingStep] = useState('permissions'); // 'permissions', 'auth', 'app'

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

  return (
    <div className="min-h-screen bg-[#03080b] flex flex-col items-center justify-center p-4 font-sans">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 tracking-wider">WEEKLY BAZAAR</h1>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Component Architecture Live</p>
      </div>
      <MobilePhoneShell title="WEEKLY BAZAAR" badge={currentUser ? currentUser.role.toUpperCase() : (onboardingStep === 'permissions' ? "SETUP" : "SECURE LOGIN")}>
        {renderMobilePortal()}
      </MobilePhoneShell>
    </div>
  );
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AppContent />
    </GlobalErrorBoundary>
  );
}