import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Building2, 
  Activity
} from 'lucide-react';

export const AdministratorWorkspace = () => {
  const { 
    activeTab, 
    staff, 
    auditLogs, 
    addStaffMember, 
    toggleStaffStatus, 
    showToast 
  } = useHospital();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Doctor');
  const [newStaffDept, setNewStaffDept] = useState('General Medicine');

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffName.trim()) {
      showToast('Staff name is required', 'error');
      return;
    }
    addStaffMember({
      name: newStaffName,
      role: newStaffRole,
      dept: newStaffDept
    });
    setNewStaffName('');
    setShowAddModal(false);
  };

  // 1. Hospital Analytics Dashboard (Screen 22 / 30)
  if (activeTab === 'Dashboard') {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Hospital Operations & Analytics Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            System Overseer Console • Enterprise Health Informatics & Governance
          </p>
        </div>

        {/* 4 Metric Cards (Screen 22 / 30) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-sm font-semibold">
              <span>Patients Today</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="mt-4 text-3xl font-bold text-slate-900 tabular-nums">128</div>
            <div className="mt-1 text-2xs text-emerald-600 font-medium">+18% vs last week</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-sm font-semibold">
              <span>Attending Doctors</span>
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-4 text-3xl font-bold text-slate-900 tabular-nums">28</div>
            <div className="mt-1 text-2xs text-slate-500">Across 12 clinical specialties</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-sm font-semibold">
              <span>Active Staff Members</span>
              <ShieldCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div className="mt-4 text-3xl font-bold text-slate-900 tabular-nums">86</div>
            <div className="mt-1 text-2xs text-purple-600 font-medium">All accounts RBAC verified</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-sm font-semibold">
              <span>Bed Occupancy</span>
              <Building2 className="w-5 h-5 text-teal-600" />
            </div>
            <div className="mt-4 text-3xl font-bold text-slate-900 tabular-nums">70%</div>
            <div className="mt-1 text-2xs text-teal-600 font-medium">28 of 40 beds occupied</div>
          </div>
        </div>

        {/* Patient Visits Trend Chart & System Summary (Screen 22 / 30) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-semibold text-slate-900 mb-2">Hospital Activity & Patient Visits</h3>
            <p className="text-xs text-slate-500 mb-6">Weekly patient intake across outpatient registration and emergency triage</p>
            
            <div className="w-full h-52 flex items-center justify-center">
              <svg viewBox="0 0 500 200" className="w-full h-full">
                <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="2" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="2" />
                <line x1="0" y1="160" x2="500" y2="160" stroke="#f1f5f9" strokeWidth="2" />
                <polyline 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="3" 
                  points="20,150 80,130 140,140 200,100 260,110 320,70 380,85 440,30" 
                />
                <circle cx="20" cy="150" r="5" fill="#10b981" />
                <circle cx="80" cy="130" r="5" fill="#10b981" />
                <circle cx="140" cy="140" r="5" fill="#10b981" />
                <circle cx="200" cy="100" r="5" fill="#10b981" />
                <circle cx="260" cy="110" r="5" fill="#10b981" />
                <circle cx="320" cy="70" r="5" fill="#10b981" />
                <circle cx="380" cy="85" r="5" fill="#10b981" />
                <circle cx="440" cy="30" r="5" fill="#10b981" />
              </svg>
            </div>
            <div className="flex justify-between text-2xs font-mono text-slate-400 mt-2 px-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              System Daily Summary
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">OPD Appointments</span>
                <span className="font-bold text-slate-900 font-mono">45</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Pathology Lab Reports</span>
                <span className="font-bold text-slate-900 font-mono">24</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Low Stock Medicine Alerts</span>
                <span className="font-bold text-rose-600 font-mono">7</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">Active Hospital Personnel</span>
                <span className="font-bold text-emerald-600 font-mono">86</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Staff & Role Management (Screen 23 / 31)
  if (activeTab === 'Staff & Roles' || activeTab === 'Users') {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hospital Staff & Role Access Control
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Create accounts, provision staff credentials and manage authorized roles
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Staff Account</span>
          </button>
        </div>

        {/* Modal for adding staff */}
        {showAddModal && (
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-4">Provision New Hospital Staff User</h3>
            <form onSubmit={handleAddStaff} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-2xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newStaffName} 
                  onChange={(e) => setNewStaffName(e.target.value)} 
                  placeholder="e.g. Dr. Sunita Sen"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs" 
                />
              </div>

              <div>
                <label className="block text-2xs font-semibold text-slate-600 mb-1">Assigned Role</label>
                <select 
                  value={newStaffRole} 
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                >
                  <option>Doctor</option>
                  <option>Nurse</option>
                  <option>Receptionist</option>
                  <option>Laboratory Technician</option>
                  <option>Pharmacist</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-semibold text-slate-600 mb-1">Department</label>
                <input 
                  type="text" 
                  value={newStaffDept} 
                  onChange={(e) => setNewStaffDept(e.target.value)} 
                  placeholder="e.g. Pediatrics"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs" 
                />
              </div>

              <div className="flex items-end gap-2">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                >
                  Confirm Provisioning
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 bg-slate-50/80">
                <th className="py-3 px-4">Staff ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Security Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{s.name}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {s.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs">{s.dept}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      s.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => toggleStaffStatus(s.id)}
                      className={`text-xs font-semibold hover:underline ${
                        s.status === 'Active' ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {s.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            <strong>RBAC Enforced:</strong> Strictly prevents unauthorized access across role boundaries. Passwords hashed using bcrypt; credentials managed through secure session tokens.
          </div>
        </div>
      </div>
    );
  }

  // 3. Administration Modules (Screen 32)
  if (activeTab === 'Departments' || activeTab === 'Reports' || activeTab === 'Settings') {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Administration Modules & System Governance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure hospital departments, export regulatory compliance reports and manage settings
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-semibold text-slate-900">Hospital Departments</h3>
            <p className="text-xs text-slate-500 mt-1">Manage clinical units, OPD schedules and ward assignments</p>
            <div className="mt-4 space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between">
                <strong>General Medicine</strong>
                <span className="text-slate-500">14 Active Physicians</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between">
                <strong>Cardiology</strong>
                <span className="text-slate-500">6 Active Physicians</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between">
                <strong>Pathology & Lab</strong>
                <span className="text-slate-500">8 Diagnostic Technicians</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-semibold text-slate-900">System Audit Logs</h3>
            <p className="text-xs text-slate-500 mt-1">Automated invisible logging of login, prescriptions & dispensations</p>
            <div className="mt-4 space-y-2 text-xs font-mono max-h-48 overflow-y-auto">
              {auditLogs.map(log => (
                <div key={log.logId} className="p-2 bg-slate-50 rounded border border-slate-200 text-2xs">
                  <span className="text-slate-400">{log.timestamp}</span> • <strong className="text-blue-600">{log.action}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
