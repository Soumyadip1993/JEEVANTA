import { useHospital } from '../context/HospitalContext';
import { ShieldCheck, KeyRound, LogOut } from 'lucide-react';

export const SharedProfile = () => {
  const { currentUser, currentRole, switchRole, showToast } = useHospital();

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Profile & Security Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage personal credentials, authorized session tokens and security controls
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Details Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
            Account Profile
          </h3>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
              <div className="font-mono text-xs text-blue-600 font-semibold">{currentUser.id}</div>
              <span className="inline-block mt-1 text-2xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {currentRole}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Registered Full Name</label>
              <input 
                type="text" 
                value={currentUser.name} 
                readOnly 
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium" 
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Official Email Address</label>
              <input 
                type="email" 
                value={currentUser.email} 
                readOnly 
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium" 
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Primary Mobile Contact</label>
              <input 
                type="tel" 
                value="9876543210" 
                readOnly 
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-mono" 
              />
            </div>
          </div>
        </div>

        {/* Security & Sessions Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Security & RBAC Enforcement</span>
            <span className="text-2xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active Session
            </span>
          </h3>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Role-Based Permissions Enforced</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your account strictly exposes only authorized clinical or administrative modules. Direct API queries across unauthorized domains return HTTP 403 Forbidden.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Session Controls
            </h4>

            <button
              onClick={() => showToast('Password reset link sent to registered email.')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Account Password</span>
            </button>

            <button
              onClick={() => {
                showToast('All active user sessions invalidated.');
                switchRole('Patient');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out All Active Devices</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
