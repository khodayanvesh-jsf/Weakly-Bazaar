import React, { useState } from 'react';

export default function AuthGateway({ onLoginSuccess }) {
  const [authStage, setAuthStage] = useState('landing');
  const [selectedRole, setSelectedRole] = useState('customer');
  const [authError, setAuthError] = useState('');
  
  const [loginForm, setLoginForm] = useState({ usernameOrPhone: '', password: '' });
  const [regForm, setRegForm] = useState({ fullName: '', phone: '', password: '', fastPin: '' });

  const handleFakeLogin = (e) => {
    e.preventDefault();
    // Simulate a successful login for now
    onLoginSuccess({
      id: 'usr_demo',
      fullName: regForm.fullName || 'Khoday Anvesh',
      role: selectedRole,
      fastPin: regForm.fastPin || '1990'
    });
  };

  return (
    <div className="flex flex-col justify-center min-h-[700px] px-4 py-2 text-white">
      <div className="flex justify-center mb-5">
        <div className="w-24 h-24 rounded-full border border-emerald-400/50 bg-gradient-to-br from-slate-900 to-emerald-950 flex flex-col items-center justify-center p-2 text-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <span className="text-4xl animate-bounce">🛍️</span>
          <span className="text-[9px] font-black tracking-widest text-emerald-300 mt-1">BAZAAR</span>
        </div>
      </div>

      {authError && <div className="bg-rose-950/80 border border-rose-500 rounded-xl p-2 mb-4 text-[11px] text-rose-200 text-center font-semibold">{authError}</div>}

      {/* LANDING SCREEN */}
      {authStage === 'landing' && (
        <div className="space-y-5 text-center animate-fade-in">
          <div>
            <h2 className="text-base font-black text-white">Adilabad Secure Portal</h2>
            <p className="text-[11px] text-slate-400 mt-1">Verified Local Accounts & Fraud Prevention</p>
          </div>
          
          <div className="text-left bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Select Account Role</label>
            <select 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)} 
              className="w-full bg-[#0a1922] border border-slate-700 text-white font-bold text-sm rounded-xl p-3 outline-none focus:border-emerald-500 transition"
            >
              <option value="customer">Customer (Shopper)</option>
              <option value="merchant">Merchant / Shop Owner</option>
              <option value="service_provider">Event Decorator</option>
              <option value="delivery_agent">Delivery Captain</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setAuthStage('signin')} className="flex-1 py-3.5 bg-slate-800 text-emerald-100 text-xs font-black rounded-xl border border-slate-700 hover:bg-slate-700 transition cursor-pointer">
              Sign In
            </button>
            <button onClick={() => setAuthStage('signup')} className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black rounded-xl shadow-lg hover:opacity-90 transition cursor-pointer">
              Register New
            </button>
          </div>
        </div>
      )}

      {/* SIGN IN SCREEN */}
      {authStage === 'signin' && (
        <form onSubmit={handleFakeLogin} className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-emerald-400 text-center mb-2">Secure Sign In</h3>
          <input type="text" required placeholder="Username or Mobile" value={loginForm.usernameOrPhone} onChange={(e) => setLoginForm({ ...loginForm, usernameOrPhone: e.target.value })} className="w-full bg-[#0a1922] border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500" />
          <input type="password" required placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full bg-[#0a1922] border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500" />
          
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={() => setAuthStage('landing')} className="px-4 py-3 bg-slate-800 text-xs font-bold rounded-xl cursor-pointer">← Back</button>
            <button type="submit" className="flex-1 py-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer">Verify & Enter</button>
          </div>
        </form>
      )}

      {/* QUICK REGISTRATION SCREEN */}
      {authStage === 'signup' && (
        <form onSubmit={handleFakeLogin} className="space-y-3 animate-fade-in">
          <h3 className="text-sm font-bold text-teal-300 text-center mb-2">Create {selectedRole.replace('_', ' ')} Account</h3>
          
          <input type="text" required placeholder="Full Name" value={regForm.fullName} onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })} className="w-full bg-[#0a1922] border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-teal-500" />
          <input type="tel" required placeholder="10-Digit Mobile" value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} className="w-full bg-[#0a1922] border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-teal-500" />
          <input type="password" required placeholder="Create Password" value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} className="w-full bg-[#0a1922] border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-teal-500" />
          
          <div>
            <label className="block text-center text-[10px] text-slate-400 mt-2 mb-1">SET 4-DIGIT QUICK PIN</label>
            <input type="password" maxLength={4} required placeholder="••••" value={regForm.fastPin} onChange={(e) => setRegForm({ ...regForm, fastPin: e.target.value })} className="w-32 mx-auto block bg-slate-900 border-2 border-teal-500/50 rounded-xl py-2.5 text-center text-xl tracking-[0.4em] font-mono text-white outline-none focus:border-teal-400" />
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={() => setAuthStage('landing')} className="px-4 py-3 bg-slate-800 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer">Complete Setup</button>
          </div>
        </form>
      )}
    </div>
  );
}