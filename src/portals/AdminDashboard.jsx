// src/portals/AdminDashboard.jsx
import React from 'react';

export default function AdminDashboard({ state }) {
  const {
    founderTab, setFounderTab,
    setViewMode,
    pendingMerchants, setPendingMerchants,
    pendingSubCategories,
    splitScreens, setSplitScreens,
    setOnboardingStep, setActivePortal,
    setAuthStage, setActiveCustomerSection,
    setDecorStep, setDecorBids,
    adminDbTab, setAdminDbTab,
    registeredUsers, setRegisteredUsers,
    products, setProducts,
    setEditingRecord,
    merchantCommissionPct, setMerchantCommissionPct,
    consumerFeePct, setConsumerFeePct
  } = state;

  return (
    <div className="min-h-screen bg-[#040c10] text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-emerald-950 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-xl">🌿</div>
          <div>
            <h1 className="text-base font-extrabold text-white">Founder Control Suite • Weekly Bazaar</h1>
            <p className="text-xs text-slate-400">Master Admin Dashboard (VocalForLocal Adilabad)</p>
          </div>
        </div>
        <button
          onClick={() => setViewMode('mobile_app')}
          className="bg-emerald-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs cursor-pointer shadow"
        >
          📱 Return to Mobile App
        </button>
      </header>

      {/* Sidebar & Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="space-y-2">
          {[
            { id: 'approvals', label: '🛡️ Approvals & KYC', count: pendingMerchants.length + pendingSubCategories.length },
            { id: 'testing', label: '🧪 Testing Sandbox Bench', count: splitScreens.length + ' Phones' },
            { id: 'flow_tester', label: '🔄 Screen Flow Tester', count: 'QA' },
            { id: 'database', label: '🗄️ Master Database Editor', count: 'Full Control' },
            { id: 'escrow', label: '💰 Escrow & Commissions', count: `${merchantCommissionPct}%` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFounderTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition border cursor-pointer ${
                founderTab === tab.id
                  ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-md'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700">
                {tab.count}
              </span>
            </button>
          ))}
        </aside>

        <main className="lg:col-span-3 space-y-6">
          {/* Approvals Tab */}
          {founderTab === 'approvals' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                <h2 className="text-sm font-bold text-emerald-400">
                  Merchant & Service Provider Onboarding Queue ({pendingMerchants.length})
                </h2>
                {pendingMerchants.length === 0 ? (
                  <p className="text-xs text-slate-400">All merchants approved!</p>
                ) : (
                  pendingMerchants.map((pm) => (
                    <div
                      key={pm.id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex justify-between items-center text-xs"
                    >
                      <div>
                        <p className="font-extrabold text-white">{pm.businessName}</p>
                        <p className="text-slate-400">Phone: {pm.phone}</p>
                      </div>
                      <button
                        onClick={() => setPendingMerchants(pendingMerchants.filter((m) => m.id !== pm.id))}
                        className="bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        ✓ Approve
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Testing Sandbox Tab */}
          {founderTab === 'testing' && (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-emerald-400">📱 Multi-Phone Testing Array</h2>
                  <p className="text-xs text-slate-300">
                    Open 4, 5, or more phones side-by-side to watch the entire ecosystem sync live.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setOnboardingStep('app');
                    setActivePortal('split');
                    setViewMode('mobile_app');
                  }}
                  className="bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs cursor-pointer shadow"
                >
                  Launch Multi-Phone View ➔
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Configure Phone Array:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {splitScreens.map((phone, idx) => (
                    <div key={phone.id} className="bg-slate-900 p-3 rounded-xl border border-slate-700 relative">
                      <button
                        onClick={() => setSplitScreens(splitScreens.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-2 text-rose-500 font-bold hover:text-rose-400 cursor-pointer"
                      >
                        ✕
                      </button>
                      <p className="text-[10px] text-slate-400">Screen {idx + 1}</p>
                      <p className="text-xs font-extrabold text-emerald-300 capitalize">
                        {phone.role.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <select
                    id="addPhoneRole"
                    className="bg-slate-900 text-xs border border-slate-700 text-white rounded p-1.5 outline-none"
                  >
                    <option value="customer">Customer</option>
                    <option value="merchant">Merchant</option>
                    <option value="service_provider">Decorator</option>
                    <option value="delivery_agent">Rider</option>
                  </select>
                  <button
                    onClick={() => {
                      const val = document.getElementById('addPhoneRole').value;
                      setSplitScreens([...splitScreens, { id: `phone_${Date.now()}`, role: val }]);
                    }}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-3 rounded text-xs cursor-pointer"
                  >
                    + Add Phone
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 1-Click Screen Flow Tester */}
          {founderTab === 'flow_tester' && (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 space-y-4 text-xs">
              <h2 className="text-base font-extrabold text-emerald-400">🔄 1-Click Screen-by-Screen Flow Tester</h2>
              <p className="text-slate-300">
                Instantly jump to any operational screen in the mobile app without manual navigation:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setOnboardingStep('permissions');
                    setViewMode('mobile_app');
                  }}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                >
                  <p className="font-bold text-emerald-300">1. Permissions Gateway</p>
                </button>
                <button
                  onClick={() => {
                    setOnboardingStep('auth');
                    setAuthStage('landing');
                    setViewMode('mobile_app');
                  }}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                >
                  <p className="font-bold text-emerald-300">2. Auth & Role Select</p>
                </button>
                <button
                  onClick={() => {
                    setOnboardingStep('auth');
                    setAuthStage('signup_step2');
                    setViewMode('mobile_app');
                  }}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                >
                  <p className="font-bold text-emerald-300">3. ID & Selfie Verification</p>
                </button>
                <button
                  onClick={() => {
                    setOnboardingStep('app');
                    setActivePortal('customer');
                    setActiveCustomerSection('shop');
                    setViewMode('mobile_app');
                  }}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                >
                  <p className="font-bold text-emerald-300">4. Customer Store Hub</p>
                </button>
                <button
                  onClick={() => {
                    setOnboardingStep('app');
                    setActivePortal('customer');
                    setActiveCustomerSection('events');
                    setDecorStep('setup');
                    setViewMode('mobile_app');
                  }}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                >
                  <p className="font-bold text-emerald-300">5. Decor Bidding (Page A)</p>
                </button>
                <button
                  onClick={() => {
                    setOnboardingStep('app');
                    setActivePortal('customer');
                    setActiveCustomerSection('events');
                    setDecorStep('bidding');
                    setDecorBids([{ id: 'b1', maskedVendor: 'Decorator #1', price: 21500, features: 'Floral arch' }]);
                    setViewMode('mobile_app');
                  }}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                >
                  <p className="font-bold text-emerald-300">6. Reverse-Bidding (Page B)</p>
                </button>
                <button
                  onClick={() => {
                    setOnboardingStep('app');
                    setActivePortal('merchant');
                    setViewMode('mobile_app');
                  }}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                >
                  <p className="font-bold text-emerald-300">7. Merchant Stock Manual</p>
                </button>
                <button
                  onClick={() => {
                    setOnboardingStep('app');
                    setActivePortal('rider');
                    setViewMode('mobile_app');
                  }}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                >
                  <p className="font-bold text-emerald-300">8. Delivery Captain Radar</p>
                </button>
              </div>
            </div>
          )}

          {/* Master Database Editor */}
          {founderTab === 'database' && (
            <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-5 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-amber-400">🗄️ Master Database Editor</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Full root access to edit, suspend, or delete accounts and products.
                  </p>
                </div>
                <span className="bg-rose-500/20 border border-rose-500/50 text-rose-300 font-extrabold px-3 py-1 rounded-full text-[10px] animate-pulse">
                  ⚠️ Live Data
                </span>
              </div>
              <div className="flex gap-2 border-b border-slate-800 pb-3">
                <button
                  onClick={() => setAdminDbTab('users')}
                  className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                    adminDbTab === 'users'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  👥 Users & Merchants
                </button>
                <button
                  onClick={() => setAdminDbTab('catalog')}
                  className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                    adminDbTab === 'catalog'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  📦 Products & Catalog
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left border-collapse bg-slate-950">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-700 text-slate-300 uppercase text-[9px] tracking-wider">
                      <th className="p-3">Data ID Ref</th>
                      <th className="p-3">Display Name / Title</th>
                      <th className="p-3">Role / Category</th>
                      <th className="p-3 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {(adminDbTab === 'users' ? registeredUsers : products).map((r, i) => (
                      <tr key={r.id || i} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-mono text-[10px] text-slate-500">{r.id || `prod_${i}`}</td>
                        <td className="p-3 font-bold text-white">{r.fullName || r.subCategoryBrand}</td>
                        <td className="p-3 font-mono text-[10px] text-emerald-400">{r.role || r.categoryId}</td>
                        <td className="p-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                setEditingRecord({
                                  type: adminDbTab,
                                  index: i,
                                  jsonStr: JSON.stringify(r, null, 2)
                                })
                              }
                              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/50 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition"
                            >
                              ✎ Edit
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to PERMANENTLY DELETE ${r.fullName || r.subCategoryBrand}?`
                                  )
                                ) {
                                  if (adminDbTab === 'users') {
                                    setRegisteredUsers(registeredUsers.filter((user) => user.id !== r.id));
                                  } else {
                                    setProducts(products.filter((prod) => prod.id !== r.id));
                                  }
                                }
                              }}
                              className="bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-700 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Escrow & Commissions Tab */}
          {founderTab === 'escrow' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 text-xs">
              <h2 className="text-sm font-bold text-emerald-400">Town Commission Governance</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <p>Merchant Commission: {merchantCommissionPct}%</p>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={merchantCommissionPct}
                    onChange={(e) => setMerchantCommissionPct(Number(e.target.value))}
                    className="w-full mt-2 accent-emerald-400"
                  />
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <p>Consumer Fee: {consumerFeePct}%</p>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={consumerFeePct}
                    onChange={(e) => setConsumerFeePct(Number(e.target.value))}
                    className="w-full mt-2 accent-emerald-400"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}