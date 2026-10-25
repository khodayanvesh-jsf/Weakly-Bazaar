// src/portals/AuthGateway.jsx
import React from 'react';
import MobilePhoneShell from '../components/MobilePhoneShell';

export default function AuthGateway({ state, actions }) {
  const {
    onboardingStep, setOnboardingStep,
    authStage, setAuthStage,
    selectedRole, setSelectedRole,
    authError, regForm, setRegForm,
    loginForm, setLoginForm,
    hasRegisteredOnDevice, currentUser, savedDeviceUser
  } = state;

  const {
    handleSendRegistrationOtp,
    handleVerifyRegistrationOtp,
    handleCaptureSelfie,
    handleCompleteIdentityStep,
    handleFinalizeRegistration,
    handlePasswordLogin,
    handlePinLogin
  } = actions;

  // SCREEN 1: PERMISSIONS GATEWAY
  if (onboardingStep === 'permissions') {
    return (
      <MobilePhoneShell title="WeeklyBazaar • Setup" badge="Step 1 of 2">
        <div className="flex flex-col justify-between h-full py-2 space-y-4 text-white">
          <div className="text-center space-y-1.5 pt-2">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 mx-auto flex items-center justify-center text-3xl shadow-lg">
              🌿
            </div>
            <h1 className="text-lg font-extrabold">Peace-of-Mind Permissions</h1>
            <p className="text-[11px] text-slate-300">Grant permissions to connect with local stores and bike captains in Adilabad.</p>
          </div>
          <div className="space-y-2.5">
            {['Location', 'Notifications', 'Camera', 'Storage'].map((p, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold">{p} Access</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-full">✓ Allowed</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setOnboardingStep('auth')}
            className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold py-3 rounded-2xl text-xs cursor-pointer shadow-lg transition"
          >
            Continue to Login / Sign Up ➔
          </button>
        </div>
      </MobilePhoneShell>
    );
  }

  // SCREEN 2: MULTI-STEP REGISTRATION, LOGIN & FAST PIN VAULT
  return (
    <MobilePhoneShell title="WeeklyBazaar • VFL" badge="Security Vault">
      <div className="flex flex-col justify-center min-h-[730px] px-3 py-2 text-white">
        <div className="flex justify-center mb-3">
          <div className="w-24 h-24 rounded-full border-2 border-emerald-400/80 bg-slate-900 flex flex-col items-center justify-center p-2 text-center shadow-[0_0_25px_rgba(16,185,129,0.25)]">
            <span className="text-3xl">🌿</span>
            <span className="text-[9px] font-black tracking-widest text-emerald-300 mt-0.5">WEEKLY BAZAAR</span>
            <span className="text-[7px] text-teal-400 font-bold">VOCAL FOR LOCAL</span>
          </div>
        </div>

        {authError && (
          <div className="bg-rose-950 border border-rose-500 rounded-xl p-2 mb-3 text-[11px] text-rose-200 text-center font-semibold">
            ⚠️ {authError}
          </div>
        )}

        {/* FAST PIN LOGIN */}
        {authStage === 'fast_login' && (
          <div className="space-y-4 px-2">
            <div className="text-center">
              <h2 className="text-sm font-bold text-emerald-400">Welcome Back</h2>
              <p className="text-xs text-slate-300 font-semibold">{currentUser?.fullName || savedDeviceUser?.fullName}</p>
            </div>
            <form onSubmit={handlePinLogin} className="space-y-3">
              <label className="block text-[10px] text-slate-400 text-center font-bold">ENTER 4-DIGIT QUICK PIN (Demo: 1990)</label>
              <input
                type="password"
                maxLength={4}
                required
                autoFocus
                placeholder="••••"
                value={loginForm.pinInput}
                onChange={(e) => setLoginForm({ ...loginForm, pinInput: e.target.value })}
                className="w-36 mx-auto block bg-slate-900 border-2 border-emerald-500 rounded-2xl py-2 text-center text-xl tracking-[0.4em] font-mono text-white outline-none"
              />
              <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer shadow">
                Unlock with PIN
              </button>
            </form>
            <div className="flex justify-between pt-2">
              <button onClick={() => setAuthStage('landing')} className="text-[10px] text-slate-400 underline cursor-pointer">
                Switch Role / Account
              </button>
              <button onClick={() => setOnboardingStep('permissions')} className="text-[10px] text-teal-400 underline cursor-pointer">
                Permissions
              </button>
            </div>
          </div>
        )}

        {/* LANDING */}
        {authStage === 'landing' && (
          <div className="space-y-4 px-3">
            <div className="text-center">
              <h2 className="text-sm font-black text-white">Adilabad Secure Portal</h2>
              <p className="text-[11px] text-slate-400">Verified Hyperlocal Accounts & Fraud Prevention</p>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Account Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-900 border-2 border-slate-700 text-white font-bold text-xs rounded-xl p-3 outline-none focus:border-emerald-400"
              >
                <option value="customer">Customer (Shopper)</option>
                <option value="merchant">Merchant (Store Partner)</option>
                <option value="service_provider">Service Provider (Event Decorator)</option>
                <option value="delivery_agent">Delivery Agent (Bike/Auto Captain)</option>
              </select>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setAuthStage('signin')}
                className="flex-1 py-3 bg-slate-800 text-white text-xs font-black rounded-xl border border-slate-700 cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthStage('signup_step1')}
                className="flex-1 py-3 bg-emerald-500 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow"
              >
                Register New
              </button>
            </div>
            {hasRegisteredOnDevice && (
              <button
                type="button"
                onClick={() => setAuthStage('fast_login')}
                className="w-full py-2.5 bg-teal-500/20 border border-teal-400 text-teal-300 text-xs font-black rounded-xl cursor-pointer"
              >
                ⚡ Quick PIN Unlock
              </button>
            )}
          </div>
        )}

        {/* SIGN IN */}
        {authStage === 'signin' && (
          <form onSubmit={handlePasswordLogin} className="space-y-3 px-3">
            <h3 className="text-xs font-bold text-emerald-400 text-center">Sign In ({selectedRole.replace('_', ' ')})</h3>
            <p className="text-[9px] text-slate-400 text-center">Demo User: anvesh_k | Pass: Adilabad@2026 (or type "admin")</p>
            <input
              type="text"
              required
              placeholder="Username or Mobile"
              value={loginForm.usernameOrPhone}
              onChange={(e) => setLoginForm({ ...loginForm, usernameOrPhone: e.target.value })}
              className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => setAuthStage('landing')} className="px-3 py-2 bg-slate-800 text-xs rounded-xl cursor-pointer">
                ← Back
              </button>
              <button type="submit" className="flex-1 py-2.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer">
                Verify & Enter
              </button>
            </div>
          </form>
        )}

        {/* SIGNUP STEP 1: OTP */}
        {authStage === 'signup_step1' && (
          <div className="space-y-3 px-3">
            <h3 className="text-xs font-bold text-white text-center">Step 1: Phone OTP Verification</h3>
            <div className="flex gap-2">
              <input
                type="tel"
                maxLength={10}
                required
                placeholder="10-Digit Mobile"
                value={regForm.phone}
                onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none"
              />
              <button type="button" onClick={handleSendRegistrationOtp} className="bg-amber-400 text-slate-950 font-bold text-[10px] px-3 rounded-xl cursor-pointer">
                Send OTP
              </button>
            </div>
            {regForm.generatedOtp && (
              <div className="space-y-2">
                <p className="text-[10px] text-emerald-400 text-center font-mono">Simulated SMS Code: {regForm.generatedOtp}</p>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6-Digit OTP"
                  value={regForm.otpInput}
                  onChange={(e) => setRegForm({ ...regForm, otpInput: e.target.value })}
                  className="w-full bg-slate-900 border border-emerald-500 rounded-xl p-2 text-center font-mono text-white outline-none"
                />
                <button type="button" onClick={handleVerifyRegistrationOtp} className="w-full bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer">
                  Verify Phone ➔
                </button>
              </div>
            )}
            <button type="button" onClick={() => setAuthStage('landing')} className="w-full text-[10px] text-slate-400 underline text-center cursor-pointer">
              ← Cancel
            </button>
          </div>
        )}

        {/* SIGNUP STEP 2: IDENTITY & SELFIE */}
        {authStage === 'signup_step2' && (
          <div className="space-y-2.5 px-3">
            <h3 className="text-xs font-bold text-white text-center">Step 2: Identity Verification</h3>
            <input
              type="text"
              required
              placeholder="Full Legal Name"
              value={regForm.fullName}
              onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none"
            />
            <input
              type="text"
              required
              placeholder="Unique Username"
              value={regForm.username}
              onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none"
            />
            <input
              type="text"
              maxLength={12}
              required
              placeholder="12-Character Gov ID Proof"
              value={regForm.govId}
              onChange={(e) => setRegForm({ ...regForm, govId: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs font-mono text-white outline-none"
            />
            <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800">
              <label className="block text-[9px] text-slate-400 mb-1">Upload Live Selfie (Optional for Demo)</label>
              <input type="file" accept="image/*" onChange={handleCaptureSelfie} className="w-full text-[10px] text-slate-300" />
            </div>
            <button type="button" onClick={handleCompleteIdentityStep} className="w-full bg-emerald-500 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer">
              Continue to Security ➔
            </button>
          </div>
        )}

        {/* SIGNUP STEP 3: PASSWORD & QUICK PIN */}
        {authStage === 'signup_step3' && (
          <div className="space-y-3 px-3">
            <h3 className="text-xs font-bold text-white text-center">Step 3: Password & PIN Setup</h3>
            <input
              type="password"
              required
              placeholder="Password (Min 8 chars, 1 Cap, 1 Num)"
              value={regForm.password}
              onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none"
            />
            <input
              type="password"
              required
              placeholder="Confirm Password"
              value={regForm.confirmPassword}
              onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none"
            />
            <input
              type="password"
              maxLength={4}
              required
              placeholder="4-Digit Quick PIN"
              value={regForm.fastPin}
              onChange={(e) => setRegForm({ ...regForm, fastPin: e.target.value })}
              className="w-36 mx-auto block bg-slate-900 border border-emerald-500 rounded-xl p-2 text-center font-mono text-white outline-none"
            />
            <button type="button" onClick={handleFinalizeRegistration} className="w-full bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer">
              Lock Device & Complete Setup
            </button>
          </div>
        )}
      </div>
    </MobilePhoneShell>
  );
}