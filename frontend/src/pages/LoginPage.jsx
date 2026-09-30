import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { UserPlus, ArrowLeft, ShieldCheck, HeartHandshake } from 'lucide-react';

export const LoginPage = () => {
  const { login, registerAndLoginPatient } = useHospital();
  
  // View toggle: 'login' | 'register_patient'
  const [isRegistering, setIsRegistering] = useState(false);

  // Login form state
  const [username, setUsername] = useState('dr.ananya');
  const [password, setPassword] = useState('password123');
  const [workspace, setWorkspace] = useState('Doctor');

  // Patient registration form state
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const defaultUsers = {
    'Doctor': 'dr.ananya',
    'Receptionist': 'priya.patel',
    'Nurse': 'nurse.sunita',
    'Laboratory Technician': 'rahul.mehta',
    'Pharmacist': 'kavita.sharma',
    'Administrator': 'rajesh.verma',
    'Patient': 'ramesh.kumar'
  };

  const handleWorkspaceChange = (selected) => {
    setWorkspace(selected);
    if (defaultUsers[selected]) {
      setUsername(defaultUsers[selected]);
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    login(username, password, workspace);
  };

  const handlePatientSignUp = (e) => {
    e.preventDefault();
    if (!regFullName.trim() || !regPhone.trim() || !regPassword.trim()) return;
    registerAndLoginPatient({
      name: regFullName.trim(),
      phone: regPhone.trim(),
      password: regPassword
    });
  };

  const workspaceOptions = [
    'Patient',
    'Receptionist',
    'Doctor',
    'Nurse',
    'Laboratory Technician',
    'Pharmacist',
    'Administrator'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-slate-800 antialiased">
      {/* 1. Spacious Top Navigation Bar */}
      <header className="h-20 bg-white border-b border-slate-200/70 px-8 sm:px-12 lg:px-16 flex items-center justify-between">
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="flex items-center gap-3 text-blue-600 font-extrabold text-xl tracking-wider select-none">
            <span className="text-2xl font-black leading-none">✚</span>
            <span className="leading-none">JEEVANTA</span>
          </div>
          <div className="text-sm text-slate-500 font-normal hidden md:block tracking-normal">
            Government Hospital Management System
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            {isRegistering ? '← Back to Staff & Portal Login' : 'Register as New Patient'}
          </button>
        </div>
      </header>

      {/* 2. Main Content Body with Generous Margins & Breathable Spacing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-8 sm:px-12 lg:px-16 pt-8 sm:pt-12 pb-16 sm:pb-24 flex flex-col">
        {/* Page Title & Subtitle with Clean Breathing Room */}
        <div className="mb-8 sm:mb-12 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0C2340] mb-3 leading-snug">
            {isRegistering ? 'Public Patient Registration' : 'Jeevanta Portal Login'}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-500 font-normal leading-relaxed max-w-2xl">
            {isRegistering 
              ? 'Create your citizen health account to schedule specialist visits, access digitized clinical prescriptions, and download diagnostic lab reports.'
              : 'Secure, role-based healthcare administration and clinical access. Select your authorized workspace before signing in.'}
          </p>
        </div>

        {/* Centered Card with Elevated Design */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[560px] bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-12 lg:p-14">
            
            {/* View 1: Public Patient Registration Form */}
            {isRegistering ? (
              <div>
                {/* Registration Brand Header */}
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-100 shadow-2xs">
                    <HeartHandshake className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    Patient Registration
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2">
                    Enter your details below to create an official patient profile
                  </p>
                </div>

                <form onSubmit={handlePatientSignUp} className="space-y-6">
                  {/* Full Name Field */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full h-14 px-5 text-sm sm:text-base bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-2xs"
                    />
                  </div>

                  {/* Phone Number Field */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full h-14 px-5 text-sm sm:text-base bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-mono shadow-2xs"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                      PASSWORD
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create a secure password"
                      className="w-full h-14 px-5 text-sm sm:text-base bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-mono shadow-2xs"
                    />
                  </div>

                  {/* Privacy & Scope Notice */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Your patient record is protected under strict Role-Based Access Control and government data minimization standards.
                    </p>
                  </div>

                  {/* Registration Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Complete Registration & Access Portal</span>
                    </button>
                  </div>

                  {/* Back to Login Toggle */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setIsRegistering(false)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Already have an account? Sign in here</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* View 2: Existing Standard Login Form */
              <div>
                {/* Card Brand Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2.5 text-blue-600 font-black text-2xl tracking-wider mb-2">
                    <span className="text-2xl leading-none">✚</span>
                    <span className="leading-none">JEEVANTA</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    Welcome back
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Sign in to your authorized hospital workspace
                  </p>
                </div>

                {/* Login Form with Generous Vertical Rhythm */}
                <form onSubmit={handleSignIn} className="space-y-6">
                  {/* Username Field */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                      USERNAME
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className="w-full h-14 px-5 text-sm sm:text-base bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                      PASSWORD
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full h-14 px-5 text-sm sm:text-base bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono shadow-2xs"
                    />
                  </div>

                  {/* Workspace Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                      WORKSPACE
                    </label>
                    <div className="relative">
                      <select
                        value={workspace}
                        onChange={(e) => handleWorkspaceChange(e.target.value)}
                        className="w-full h-14 px-5 pr-12 text-sm sm:text-base bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium appearance-none cursor-pointer shadow-2xs"
                      >
                        <option value="" disabled>Select your workspace ▼</option>
                        {workspaceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 text-xs">
                        ▼
                      </div>
                    </div>

                    {/* Subtitle list of workspaces under dropdown */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-slate-500 mt-3 px-1 leading-relaxed">
                      {workspaceOptions.map((opt, i) => (
                        <span key={opt} className="inline-flex items-center">
                          <button
                            type="button"
                            onClick={() => handleWorkspaceChange(opt)}
                            className={`hover:text-blue-600 transition-colors cursor-pointer py-0.5 ${
                              workspace === opt 
                                ? 'font-bold text-blue-600 underline underline-offset-4' 
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {opt}
                          </button>
                          {i < workspaceOptions.length - 1 && (
                            <span className="mx-1.5 text-slate-300">•</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Sign In to {workspace}</span>
                      <span>&rarr;</span>
                    </button>
                  </div>

                  {/* Public Patient Sign-Up Link / Button (Requirement 1) */}
                  <div className="pt-3 border-t border-slate-100 text-center space-y-2">
                    <p className="text-xs sm:text-sm text-slate-500">
                      Are you a patient seeking medical care?
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsRegistering(true)}
                      className="w-full h-12 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs sm:text-sm border border-emerald-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Register as a new patient</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Bottom RBAC Note with Spacious Margin */}
            <div className="text-center text-xs text-slate-400 mt-8 pt-4 border-t border-slate-100 tracking-normal leading-relaxed">
              RBAC Protected • Multi-Role Secure Clinical Infrastructure
            </div>
          </div>
        </div>
      </main>

      {/* 3. Bottom Footer Note with Comfortable Padding */}
      <footer className="px-8 sm:px-14 py-6 text-xs text-slate-400 border-t border-slate-200/60 flex items-center justify-between">
        <span>City Government General Hospital • Jeevanta EMR System</span>
        <span>Version 2.4.0 (Enterprise)</span>
      </footer>
    </div>
  );
};
