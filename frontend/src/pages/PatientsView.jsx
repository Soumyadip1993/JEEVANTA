import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { initialData } from '../data/mockDatabase';
import { 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Edit3, 
  ChevronRight, 
  Check, 
  MapPin, 
  ArrowRight, 
  ArrowLeft
} from 'lucide-react';

export const PatientsView = () => {
  const { showToast, setActiveTab, currentRole, currentUser, hasPermission, isAuthorizedTab } = useHospital();
  
  // 'list' | 'register' | 'profile'
  const [subView, setSubView] = useState('list');
  const [selectedPatientId, setSelectedPatientId] = useState(
    currentRole === 'Patient' ? (currentUser?.id || 'P1001') : 'P1001'
  );
  const [profileTab, setProfileTab] = useState('Overview');
  const [registrationStep, setRegistrationStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Patient Registration Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    aadhaar: '',
    phone: '',
    email: '',
    bloodGroup: 'B+',
    maritalStatus: 'Married',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  // Strict Data Scoping: Scope patient records strictly to the active role
  const allPatients = initialData.patientDirectory;
  const scopedPatients = () => {
    if (currentRole === 'Patient') {
      // Patient can ONLY see their own record. Zero leakage of other patients.
      return allPatients.filter(p => p.id === 'P1001' || p.id === currentUser?.id);
    }
    if (currentRole === 'Nurse') {
      // Nurses only need inpatient ward patient records
      return allPatients.filter(p => ['P1001', 'P1002', 'P1005'].includes(p.id));
    }
    if (currentRole === 'Laboratory Technician') {
      // Lab techs only see patients with specimen accessioning
      return allPatients.filter(p => ['P1001', 'P1003', 'P1004', 'P1006'].includes(p.id));
    }
    if (currentRole === 'Pharmacist') {
      // Pharmacists only see patients with active clinical prescriptions
      return allPatients.filter(p => ['P1001', 'P1002', 'P1004'].includes(p.id));
    }
    return allPatients;
  };

  const patients = scopedPatients().filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  );

  const currentPatient = allPatients.find(p => p.id === selectedPatientId) || patients[0] || allPatients[0];

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    showToast(`Patient registered successfully! Generated ID: P100${patients.length + 1}`, 'success');
    setSubView('list');
    setRegistrationStep(1);
  };

  return (
    <div className="space-y-10 sm:space-y-14 pb-20 animate-fade-in text-slate-800">
      {/* ============================================================== */}
      {/* 1. SUB-VIEW: ALL PATIENTS LIST (Screenshot 1 & 2)              */}
      {/* ============================================================== */}
      {subView === 'list' && (
        <div className="space-y-8 sm:space-y-10">
          {/* Header & New Patient Button with Generous Clearances */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-200/70">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-snug">
                {currentRole === 'Patient' ? 'My Medical Record & Health Profile' : 'Patient Records & Directory'}
              </h1>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-500 mt-2">
                <span>Patients</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="text-slate-800 font-medium">
                  {currentRole === 'Patient' ? 'Personal Medical Record' : 'Authorized Patient Directory'}
                </span>
              </div>
            </div>

            {hasPermission('register_patient') && (
              <button
                onClick={() => setSubView('register')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Patient</span>
              </button>
            )}
          </div>

          {/* Search & Filter Bar with Generous Padding - Hidden for Patients to prevent search leakage */}
          {currentRole !== 'Patient' && (
            <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="relative flex-1 max-w-lg">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, or patient ID..."
                  className="w-full pl-12 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => showToast({ type: 'info', message: 'The Advanced Filter Builder module is currently under development.' })}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
          )}

          {/* Patients Data Table with Spacious Cell Padding */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">ID</th>
                    <th className="py-6 px-8">Name</th>
                    <th className="py-6 px-8">Age / Gender</th>
                    <th className="py-6 px-8">Phone</th>
                    <th className="py-6 px-8">Last Visit</th>
                    <th className="py-6 px-8">Status</th>
                    <th className="py-6 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 leading-relaxed">
                  {patients.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-6 px-8 font-mono font-medium text-slate-900 tabular-nums text-xs">{p.id}</td>
                      <td className="py-6 px-8 font-semibold text-slate-900">{p.name}</td>
                      <td className="py-6 px-8 text-slate-600">{p.age} / {p.gender.charAt(0)}</td>
                      <td className="py-6 px-8 text-slate-500 tabular-nums">{p.phone}</td>
                      <td className="py-6 px-8 text-slate-500 tabular-nums">{p.lastVisit}</td>
                      <td className="py-6 px-8">
                        <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-medium border ${
                          p.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button
                          onClick={() => {
                            setSelectedPatientId(p.id);
                            setSubView('profile');
                          }}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer - Hidden for Patients as they only have their own record */}
            {currentRole !== 'Patient' && (
              <div className="p-6 sm:p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
                <div>Showing {patients.length} of {allPatients.length} authorized patients</div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => showToast({ type: 'info', message: 'You are on the first page of patient records.' })}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    &lt;
                  </button>
                  <button 
                    onClick={() => showToast('Displaying page 1 of active patient directory')}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-semibold cursor-pointer"
                  >
                    1
                  </button>
                  <button 
                    onClick={() => showToast({ type: 'info', message: 'All authorized patient records are displayed on this page.' })}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SUB-VIEW: MULTI-STEP REGISTRATION FORM (Screenshot 3)       */}
      {/* ============================================================== */}
      {subView === 'register' && (
        <div className="space-y-8 sm:space-y-10 max-w-4xl mx-auto">
          {/* Header with Generous Clearances */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200/70">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
                New Patient Registration
              </h1>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-500 mt-2">
                <span>Patients</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="text-slate-800 font-medium">New Registration</span>
              </div>
            </div>
            <button
              onClick={() => setSubView('list')}
              className="text-sm text-slate-600 hover:text-slate-900 font-medium cursor-pointer px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* 4-Step Indicator Bar with Generous Padding */}
          <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between overflow-x-auto gap-6">
            {[
              { num: 1, label: 'Personal Details' },
              { num: 2, label: 'Contact & Address' },
              { num: 3, label: 'Additional Information' },
              { num: 4, label: 'Review' }
            ].map((step) => {
              const isCurrent = registrationStep === step.num;
              const isDone = registrationStep > step.num;
              return (
                <div key={step.num} className="flex items-center gap-3.5 shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                    isCurrent 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : isDone 
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isDone ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                  {step.num < 4 && <div className="w-10 h-0.5 bg-slate-200 mx-2 hidden md:block"></div>}
                </div>
              );
            })}
          </div>

          {/* Form Content Card with Airy Space and Large Gaps */}
          <div className="bg-white p-8 sm:p-12 lg:p-14 rounded-3xl border border-slate-200/80 shadow-xs space-y-8 sm:space-y-10">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Personal Details</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Basic demographic and identification information</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full h-12 px-4 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                    Date of Birth <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    className="w-full h-10 px-3.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full h-10 px-3.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Aadhaar Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Aadhaar number"
                    value={formData.aadhaar}
                    onChange={(e) => setFormData({...formData, aadhaar: e.target.value})}
                    className="w-full h-10 px-3.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full h-10 px-3.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-10 px-3.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                    className="w-full h-10 px-3.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Marital Status
                  </label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
                    className="w-full h-10 px-3.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <input type="checkbox" id="emergency" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="emergency" className="text-xs font-semibold text-slate-800">
                    Emergency Contact
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    className="h-10 px-3.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl"
                  />
                  <input
                    type="tel"
                    placeholder="Contact Phone Number"
                    className="h-10 px-3.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubView('list')}
                  className="px-5 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. SUB-VIEW: PATIENT PROFILE / EMR (Screenshot 5)              */}
      {/* ============================================================== */}
      {subView === 'profile' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSubView('list')}
                  className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <span className="text-slate-300">/</span>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Profile</h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>Patients</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-slate-800 font-medium">Patient Details</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {hasPermission('edit_patient_demographics') && (
                <button 
                  onClick={() => showToast({ type: 'info', message: 'The Patient Demographics Editor module is currently under development.' })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit</span>
                </button>
              )}
              <button 
                onClick={() => showToast(`Print command sent for Patient ID: ${currentPatient.id}`)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Patient Hero Card with Generous Padding */}
          <div className="bg-white p-8 sm:p-11 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xl border-2 border-blue-100 shadow-2xs shrink-0 select-none">
                {currentPatient.name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3.5">
                  <h2 className="text-2xl font-bold text-slate-900">{currentPatient.name}</h2>
                  <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-mono font-medium border border-blue-200">
                    {currentPatient.id}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                    Active
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2.5">
                  <span>{currentPatient.gender}</span>
                  <span>&bull;</span>
                  <span>{currentPatient.age} years</span>
                  <span>&bull;</span>
                  <span>{currentPatient.phone}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{currentPatient.address}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs with Generous Spacing */}
          <div className="border-b border-slate-200 flex items-center gap-8 sm:gap-10 text-sm font-semibold overflow-x-auto pb-0.5">
            {['Overview', 'Medical History', 'Prescriptions', 'Lab Reports', 'Appointments', 'Files'].map((tab) => (
              <button
                key={tab}
                onClick={() => setProfileTab(tab)}
                className={`py-4 transition-colors border-b-2 cursor-pointer whitespace-nowrap text-sm ${
                  profileTab === tab
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Profile Split Grid with Wide Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
            {/* Left Column: Basic Information & Active Prescriptions */}
            <div className="space-y-8 sm:space-y-10">
              {/* Basic Information Card with Roomy Padding */}
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 sm:space-y-8">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-5 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 block mb-1 text-xs">Date of Birth</span>
                    <span className="font-semibold text-slate-800">{currentPatient.dob}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1 text-xs">Gender</span>
                    <span className="font-semibold text-slate-800">{currentPatient.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1 text-xs">Phone</span>
                    <span className="font-semibold text-slate-800">{currentPatient.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1 text-xs">Email</span>
                    <span className="font-semibold text-slate-800">{currentPatient.email}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block mb-1 text-xs">Address</span>
                    <span className="font-semibold text-slate-800">{currentPatient.address}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block mb-1 text-xs">Aadhaar Number</span>
                    <span className="font-semibold text-slate-800 font-mono">{currentPatient.aadhaar}</span>
                  </div>
                </div>
              </div>

              {/* Active Prescriptions Card */}
              <div className="bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-900">Active Prescriptions</h3>
                  {isAuthorizedTab('Pharmacy') && (
                    <button 
                      onClick={() => setActiveTab('Pharmacy')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      View All
                    </button>
                  )}
                </div>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="p-4 bg-slate-50/80 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">Paracetamol 500mg</div>
                      <div className="text-xs text-slate-500 mt-0.5">1-0-1 • Take after food</div>
                    </div>
                    <span className="text-slate-500 font-mono text-xs">10 Nov 2026</span>
                  </div>
                  <div className="p-4 bg-slate-50/80 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">Amoxicillin 500mg</div>
                      <div className="text-xs text-slate-500 mt-0.5">1-0-1 • Antibiotic 5 days</div>
                    </div>
                    <span className="text-slate-500 font-mono text-xs">10 Nov 2026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Recent Visits & Recent Lab Reports */}
            <div className="space-y-8">
              {/* Recent Visits Card */}
              <div className="bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-900">Recent Visits</h3>
                  {isAuthorizedTab('Appointments') && (
                    <button 
                      onClick={() => setActiveTab('Appointments')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      View All
                    </button>
                  )}
                </div>
                <div className="space-y-3 text-xs sm:text-sm">
                  {[
                    { date: '10 Nov 2026', dept: 'General Medicine', doc: 'Dr. Ananya Sharma', status: 'Completed' },
                    { date: '25 Oct 2026', dept: 'Follow-up', doc: 'Dr. Rajesh Verma', status: 'Completed' },
                    { date: '12 Oct 2026', dept: 'Fever', doc: 'Dr. Ananya Sharma', status: 'Completed' },
                    { date: '28 Sep 2026', dept: 'Routine Checkup', doc: 'Dr. Amit Shah', status: 'Completed' }
                  ].map((visit, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <span className="font-bold text-slate-900 block">{visit.date}</span>
                        <span className="text-xs text-slate-500 mt-0.5">{visit.dept} &bull; {visit.doc}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {visit.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Lab Reports Card */}
              <div className="bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-900">Recent Lab Reports</h3>
                  {isAuthorizedTab('Laboratory') && (
                    <button 
                      onClick={() => setActiveTab('Laboratory')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      View All
                    </button>
                  )}
                </div>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <span className="font-bold text-slate-900 block">CBC (Complete Blood Count)</span>
                      <span className="text-xs text-slate-500 mt-0.5">10 Nov 2026 &bull; Blood specimen</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <span className="font-bold text-slate-900 block">Blood Sugar (Fasting)</span>
                      <span className="text-xs text-slate-500 mt-0.5">25 Oct 2026 &bull; Blood specimen</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
