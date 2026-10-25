import React, { useState } from 'react';

export default function AuthGateway({ onLoginSuccess }) {
  const savedDeviceUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('vfl_device_user') || 'null') : null;
  const [authStage, setAuthStage] = useState(savedDeviceUser ? 'fast_login' : 'landing');
  const [selectedRole, setSelectedRole] = useState(savedDeviceUser?.role || 'customer');
  const [authError, setAuthError] = useState('');

  const [loginForm, setLoginForm] = useState({ usernameOrPhone: '', password: '', pinInput: '' });
  const [regForm, setRegForm] = useState({ fullName: '', username: '', phone: '', generatedOtp: '', otpInput: '', govId: '', password: '', confirmPassword: '', fastPin: '' });

  const handleFakeLogin = (userObj) => {
    localStorage.setItem('vfl_device_user', JSON.stringify(userObj));
    onLoginSuccess(userObj);
  };

  return (
    <div className="flex flex-col justify-center min-h-[730px] px-3 py-2 text-white">
      <div className="flex justify-center mb-3">
        <div className="w-24 h-24 rounded-full border-2 border-emerald-400/80 bg-slate-900 flex flex-col items-center justify-center p-2 text-center shadow-lg">
          <span className="text-3xl">🌿</span>
          <span className="text-[9px] font-black tracking-widest text-emerald-300">WEEKLY BAZAAR</span>
        </div>
      </div>

      {authError && <div className="bg-rose-950 border border-rose-500 rounded-xl p-2 mb-2 text-[11px] text-rose-200 text-center font-semibold">⚠️ {authError}</div>}

      {/* FAST PIN LOGIN */}
      {authStage === 'fast_login' && savedDeviceUser && (
        <div className="space-y-4 px-2 animate-fade-in">
          <div className="text-center">
            <h2 className="text-sm font-bold text-emerald-400">Welcome Back</h2>
            <p className="text-xs text-slate-300 font-semibold">{savedDeviceUser.fullName}</p>
          </div>
          <div className="space-y-3">
            <label className="block text-[10px] text-slate-400 text-center font-bold">ENTER 4-DIGIT QUICK PIN</label>
            <input type="password" maxLength={4} required autoFocus placeholder="••••" value={loginForm.pinInput} onChange={(e) => setLoginForm({ ...loginForm, pinInput: e.target.value })} className="w-36 mx-auto block bg-slate-900 border-2 border-emerald-500 rounded-2xl py-2 text-center text-xl tracking-[0.4em] font-mono text-white outline-none" />
            <button onClick={() => { if(loginForm.pinInput === savedDeviceUser.fastPin) handleFakeLogin(savedDeviceUser); else setAuthError('Incorrect 4-Digit PIN.'); }} className="w-full bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer shadow">Unlock with PIN</button>
            <button onClick={() => { localStorage.removeItem('vfl_device_user'); setAuthStage('landing'); }} className="w-full text-[10px] text-slate-400 underline cursor-pointer">Switch Account</button>
          </div>
        </div>
      )}

      {/* LANDING */}
      {authStage === 'landing' && (
        <div className="space-y-4 px-3 animate-fade-in">
          <div className="text-center">
            <h2 className="text-sm font-black text-white">Adilabad Secure Portal</h2>
            <p className="text-[11px] text-slate-400">Verified Hyperlocal Accounts & Fraud Prevention</p>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Account Role</label>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full bg-slate-900 border-2 border-slate-700 text-white font-bold text-xs rounded-xl p-3 outline-none">
              <option value="customer">Customer</option>
              <option value="merchant">Merchant</option>
              <option value="service_provider">Service Provider / Decorator</option>
              <option value="delivery_agent">Delivery Agent</option>
            </select>
          </div>
          <div className="flex gap-2.5 pt-2">
            <button onClick={() => setAuthStage('signin')} className="flex-1 py-3 bg-slate-800 text-white text-xs font-black rounded-xl border border-slate-700 cursor-pointer">Sign In</button>
            <button onClick={() => setAuthStage('signup_step1')} className="flex-1 py-3 bg-emerald-500 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow">Register New</button>
          </div>
        </div>
      )}

      {/* SIGN IN */}
      {authStage === 'signin' && (
        <form onSubmit={(e) => { e.preventDefault(); handleFakeLogin({ fullName: loginForm.usernameOrPhone || 'Demo User', role: selectedRole, fastPin: '1990' }); }} className="space-y-3 px-3 animate-fade-in">
          <h3 className="text-xs font-bold text-emerald-400 text-center">Sign In</h3>
          <input type="text" required placeholder="Username or Mobile" value={loginForm.usernameOrPhone} onChange={(e) => setLoginForm({ ...loginForm, usernameOrPhone: e.target.value })} className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none" />
          <input type="password" required placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setAuthStage('landing')} className="px-3 py-2 bg-slate-800 text-xs rounded-xl cursor-pointer">← Back</button>
            <button type="submit" className="flex-1 py-2.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer">Verify & Enter</button>
          </div>
        </form>
      )}

      {/* REGISTRATION: STEP 1 (OTP) */}
      {authStage === 'signup_step1' && (
        <div className="space-y-3 px-3 animate-fade-in">
          <h3 className="text-xs font-bold text-white text-center">Step 1: Phone OTP</h3>
          <div className="flex gap-2">
            <input type="tel" maxLength={10} required placeholder="10-Digit Mobile" value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none" />
            <button type="button" onClick={() => { setRegForm({...regForm, generatedOtp: '123456'}); alert('Test OTP is 123456'); }} className="bg-amber-400 text-slate-950 font-bold text-[10px] px-3 rounded-xl cursor-pointer">Send OTP</button>
          </div>
          {regForm.generatedOtp && (
            <div className="space-y-2">
              <input type="text" maxLength={6} placeholder="6-Digit OTP" value={regForm.otpInput} onChange={(e) => setRegForm({ ...regForm, otpInput: e.target.value })} className="w-full bg-slate-900 border border-emerald-500 rounded-xl p-2 text-center font-mono text-white outline-none" />
              <button type="button" onClick={() => { if(regForm.otpInput === regForm.generatedOtp) setAuthStage('signup_step2'); else setAuthError('Invalid OTP'); }} className="w-full bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer">Verify Phone ➔</button>
            </div>
          )}
        </div>
      )}

      {/* REGISTRATION: STEP 2 (KYC) */}
      {authStage === 'signup_step2' && (
        <div className="space-y-2.5 px-3 animate-fade-in">
          <h3 className="text-xs font-bold text-white text-center">Step 2: Identity Verification</h3>
          <input type="text" required placeholder="Full Legal Name" value={regForm.fullName} onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none" />
          <input type="text" required placeholder="Unique Username" value={regForm.username} onChange={(e) => setRegForm({ ...regForm, username: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none" />
          <input type="text" maxLength={12} required placeholder="12-Char Gov ID Proof" value={regForm.govId} onChange={(e) => setRegForm({ ...regForm, govId: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs font-mono text-white outline-none" />
          <button type="button" onClick={() => { if(regForm.fullName) setAuthStage('signup_step3'); else setAuthError('Name required'); }} className="w-full bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer mt-2">Continue to Security ➔</button>
        </div>
      )}

      {/* REGISTRATION: STEP 3 (PIN) */}
      {authStage === 'signup_step3' && (
        <div className="space-y-3 px-3 animate-fade-in">
          <h3 className="text-xs font-bold text-white text-center">Step 3: Password & PIN Setup</h3>
          <input type="password" required placeholder="Create Password" value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none" />
          <input type="password" maxLength={4} required placeholder="4-Digit Quick PIN" value={regForm.fastPin} onChange={(e) => setRegForm({ ...regForm, fastPin: e.target.value })} className="w-36 mx-auto block bg-slate-900 border border-emerald-500 rounded-xl p-2 text-center font-mono text-white outline-none" />
          <button type="button" onClick={() => handleFakeLogin({ fullName: regForm.fullName, role: selectedRole, fastPin: regForm.fastPin || '1990' })} className="w-full bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer shadow">Lock Device & Complete Setup</button>
        </div>
      )}
    </div>
  );
}