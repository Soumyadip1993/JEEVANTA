import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { initialData } from '../data/mockDatabase';
import { 
  ShieldCheck, 
  Save, 
  ChevronRight,
  Settings,
  UserPlus
} from 'lucide-react';

export const SettingsView = () => {
  const { showToast, hasPermission, staff, toggleStaffStatus, addStaffMember, auditLogs } = useHospital();
  const [activeSubTab, setActiveSubTab] = useState('Hospital Profile');

  // Staff registration form state
  const [staffFullName, setStaffFullName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffEmployeeId, setStaffEmployeeId] = useState('');
  const [staffRole, setStaffRole] = useState('Doctor');

  const handleRegisterStaff = (e) => {
    e.preventDefault();
    if (!staffFullName.trim() || !staffEmail.trim() || !staffEmployeeId.trim()) {
      showToast('Please fill in all required staff fields', 'error');
      return;
    }

    const normalizedRole = staffRole === 'Lab Technician' ? 'Laboratory Technician' : staffRole;
    addStaffMember({
      name: staffFullName.trim(),
      email: staffEmail.trim(),
      employeeId: staffEmployeeId.trim(),
      role: normalizedRole
    });

    setStaffFullName('');
    setStaffEmail('');
    setStaffEmployeeId('');
    setStaffRole('Doctor');
  };

  const [hospitalInfo, setHospitalInfo] = useState({
    name: 'City Government General Hospital',
    code: 'CGGH-BLR-01',
    address: '12, Hospital Road, Central District, Bengaluru',
    email: 'info@cityhospital.gov.in',
    phone: '080-23456789',
    helpline: '108 / 102'
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Hospital configuration settings saved successfully!', 'success');
  };

  return (
    <div className="space-y-10 sm:space-y-12 pb-20 animate-fade-in max-w-6xl mx-auto text-slate-800">
      {/* Header with Generous Clearances */}
      <div className="pb-6 sm:pb-8 border-b border-slate-200/70">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 flex items-center gap-3.5 leading-snug">
          <Settings className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Hospital Settings & Governance</span>
        </h1>
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-500 mt-2">
          <span>Settings</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-slate-800 font-medium">{activeSubTab}</span>
        </div>
      </div>

      {/* Tabs with Generous Spacing */}
      <div className="border-b border-slate-200 flex items-center gap-8 sm:gap-10 text-sm font-semibold overflow-x-auto pb-0.5">
        {['Hospital Profile', 'Staff & RBAC Roles', 'Audit Logs', 'Security & Sessions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`py-4 transition-colors border-b-2 cursor-pointer text-sm whitespace-nowrap ${
              activeSubTab === tab
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeSubTab === 'Hospital Profile' && (
        <form onSubmit={handleSave} className="bg-white p-8 sm:p-12 lg:p-14 rounded-3xl border border-slate-200/80 shadow-xs space-y-8 sm:space-y-10">
          <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-3xl shadow-2xs shrink-0">
              🏥
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Hospital Facility Identification</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Government facility registry & public health contact details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                Hospital Name
              </label>
              <input
                type="text"
                value={hospitalInfo.name}
                onChange={(e) => setHospitalInfo({...hospitalInfo, name: e.target.value})}
                className="w-full h-12 px-4 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                Facility Registry Code
              </label>
              <input
                type="text"
                value={hospitalInfo.code}
                disabled
                className="w-full h-12 px-4 text-sm bg-slate-100 border border-slate-200 rounded-2xl font-mono text-slate-600 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                Physical Address
              </label>
              <input
                type="text"
                value={hospitalInfo.address}
                onChange={(e) => setHospitalInfo({...hospitalInfo, address: e.target.value})}
                className="w-full h-12 px-4 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                Official Email
              </label>
              <input
                type="email"
                value={hospitalInfo.email}
                onChange={(e) => setHospitalInfo({...hospitalInfo, email: e.target.value})}
                className="w-full h-12 px-4 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                Telephone & Helpline
              </label>
              <input
                type="text"
                value={hospitalInfo.phone}
                onChange={(e) => setHospitalInfo({...hospitalInfo, phone: e.target.value})}
                className="w-full h-12 px-4 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-100">
            {hasPermission('manage_settings') ? (
              <button
                type="submit"
                className="h-13 px-8 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400 font-medium italic">Read-only governance policy</span>
            )}
          </div>
        </form>
      )}

      {activeSubTab === 'Staff & RBAC Roles' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-7 sm:p-9 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Authorized System Personnel & Roles</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">7 Core RBAC Roles with strict permission boundaries</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-6 px-8">Role Name</th>
                  <th className="py-6 px-8">Key Responsibilities</th>
                  <th className="py-6 px-8">Security Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 leading-relaxed">
                {initialData.roles.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60">
                    <td className="py-6 px-8 font-semibold text-slate-900">{r.label}</td>
                    <td className="py-6 px-8 text-slate-600 leading-relaxed text-sm">{r.desc}</td>
                    <td className="py-6 px-8">
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        Level {r.id === 'Administrator' ? '5 (Full)' : r.id === 'Doctor' ? '4 (Clinical)' : '3 (Specialized)'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Admin Staff Registration Section - Strictly Gated by hasPermission('manage_staff') */}
          {hasPermission('manage_staff') && (
            <div className="p-7 sm:p-9 border-t border-slate-100 bg-slate-50/70 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Register Staff Member
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Provision an operational account with role-scoped clinical or administrative privileges
                  </p>
                </div>
              </div>

              <form onSubmit={handleRegisterStaff} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={staffFullName}
                      onChange={(e) => setStaffFullName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="w-full h-11 px-4 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      placeholder="e.g. rajesh.s@jeevanta.gov"
                      className="w-full h-11 px-4 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                    />
                  </div>

                  {/* Employee ID */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Employee ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={staffEmployeeId}
                      onChange={(e) => setStaffEmployeeId(e.target.value)}
                      placeholder="e.g. DOC-108 or STF-12"
                      className="w-full h-11 px-4 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                    />
                  </div>

                  {/* Role Dropdown strictly limited to: Doctor, Nurse, Pharmacist, Lab Technician, Receptionist */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Assigned Role *
                    </label>
                    <select
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value)}
                      className="w-full h-11 px-4 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs cursor-pointer"
                    >
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Pharmacist">Pharmacist</option>
                      <option value="Lab Technician">Lab Technician</option>
                      <option value="Receptionist">Receptionist</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Role automatically scopes operational dashboard, permissions, and navigation clearance</span>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register Staff Member</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Active Staff Directory with Action Masking */}
          <div className="p-7 sm:p-9 border-t border-b border-slate-100 flex items-center justify-between mt-6 bg-slate-50/50">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Provisioned Hospital Staff Accounts</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Operational accounts mapped to certified RBAC roles</p>
            </div>
            {hasPermission('manage_staff') && (
              <button
                onClick={() => showToast('Use the Register Staff Member form above to provision new accounts', 'info')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                + Provision Staff Account
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-6 px-8">Staff ID</th>
                  <th className="py-6 px-8">Name</th>
                  <th className="py-6 px-8">Role</th>
                  <th className="py-6 px-8">Department</th>
                  <th className="py-6 px-8">Status</th>
                  <th className="py-6 px-8 text-right">Account State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 leading-relaxed">
                {staff?.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="py-6 px-8 font-mono text-xs font-bold text-slate-900">{s.id}</td>
                    <td className="py-6 px-8 font-semibold text-slate-900">{s.name}</td>
                    <td className="py-6 px-8 text-slate-600">{s.role}</td>
                    <td className="py-6 px-8 text-slate-500">{s.dept}</td>
                    <td className="py-6 px-8">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        s.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      {hasPermission('toggle_staff_status') ? (
                        <button
                          onClick={() => toggleStaffStatus(s.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                            s.status === 'Active'
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {s.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs font-mono">Governed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'Audit Logs' && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Compliance & Security Audit Trail</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Immutable record of all clinical, dispensing & user events</p>
            </div>
          </div>
          <div className="space-y-4">
            {(auditLogs || initialData.auditLogs).map((log, idx) => (
              <div key={log.logId || log.id || idx} className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                    ID
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{log.action}</span>
                    <span className="text-xs text-slate-500 mt-0.5">{log.user} &bull; {log.role || log.details || 'System'}</span>
                  </div>
                </div>
                <span className="font-mono text-xs text-slate-400 shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'Security & Sessions' && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Sessions & Two-Factor Authentication</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Enforce government healthcare cybersecurity directives</p>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-900 text-sm">HIPAA & Government Data Privacy Protected</h4>
              <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                All patient demographic information, clinical diagnostic logs, and pharmacy dispensation records are encrypted at rest with AES-256 and in transit via TLS 1.3.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
