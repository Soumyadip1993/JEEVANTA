import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Users, 
  Calendar, 
  Clock, 
  Bed, 
  UserPlus, 
  CheckCircle2 
} from 'lucide-react';

export const ReceptionWorkspace = () => {
  const { 
    activeTab, 
    setActiveTab, 
    queue, 
    wards, 
    registerPatient, 
    advanceQueueToken,
    showToast 
  } = useHospital();

  // Registration Form State
  const formStep = 1;
  const [fullName, setFullName] = useState('Usha Sharma');
  const [dob, setDob] = useState('2006-06-10');
  const [gender, setGender] = useState('Female');
  const [mobile, setMobile] = useState('9876543210');
  const [address, setAddress] = useState('12, MG Road, Kolkata');
  const [department, setDepartment] = useState('General Medicine');
  const visitType = 'Walk-in';
  const [generatedId, setGeneratedId] = useState(null);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim()) {
      showToast('Please fill all mandatory patient details', 'error');
      return;
    }
    const newId = registerPatient({
      name: fullName,
      dob,
      gender,
      phone: mobile,
      department,
      visitType
    });
    setGeneratedId(newId);
    showToast(`Patient registered! Assigned Patient ID: ${newId}`);
  };

  // Calculate totals
  const totalBeds = wards.reduce((acc, w) => acc + w.totalBeds, 0);
  const occupiedBeds = wards.reduce((acc, w) => acc + w.occupied, 0);
  const availableBeds = totalBeds - occupiedBeds;
  const waitingCount = queue.filter(q => q.stage === 'waiting').length;

  // 1. Reception Control Center Dashboard
  if (activeTab === 'Dashboard') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Reception Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Outpatient registration, queue triage and real-time bed capacity tracking
          </p>
        </div>

        {/* 4 Restrained Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Patients Today</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">128</div>
            <div className="mt-1 text-[11px] text-slate-400">84 walk-ins • 44 appointments</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Appointments</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">45</div>
            <div className="mt-1 text-[11px] text-emerald-700 font-medium">32 checked in</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Waiting in Queue</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">{waitingCount}</div>
            <div className="mt-1 text-[11px] text-amber-800 font-medium">Est. wait: 14 mins</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Beds Available</span>
              <Bed className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
              {availableBeds} <span className="text-xs font-normal text-slate-400">/ {totalBeds}</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">{occupiedBeds} currently occupied</div>
          </div>
        </div>

        {/* Clean Row-Based Queue Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Today's OPD Queue</h2>
              <p className="text-xs text-slate-400 mt-0.5">Sequential daily queue sequence for OPD General Medicine</p>
            </div>
            <div className="flex gap-2.5">
              <button 
                onClick={() => setActiveTab('Patients')}
                className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Walk-in Registration</span>
              </button>
              <button 
                onClick={() => setActiveTab('Queue')}
                className="h-9 px-3.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
              >
                View Live Board
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Token #</th>
                  <th className="py-3 px-5">Patient Name</th>
                  <th className="py-3 px-5">Patient ID</th>
                  <th className="py-3 px-5">Time Slot</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queue.map((item) => (
                  <tr key={item.token} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-blue-600 text-xs">{item.token}</td>
                    <td className="py-3.5 px-5 font-semibold text-slate-900 text-xs">{item.patient}</td>
                    <td className="py-3.5 px-5 font-mono text-[11px] text-slate-400">{item.patientId}</td>
                    <td className="py-3.5 px-5 text-slate-500 text-xs font-mono">{item.time}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        item.stage === 'completed' 
                          ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' 
                          : item.stage === 'in_consultation'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          : 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {item.stage === 'waiting' && (
                        <button
                          onClick={() => advanceQueueToken(item.token, 'in_consultation')}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          Send to Doctor &rarr;
                        </button>
                      )}
                      {item.stage === 'in_consultation' && (
                        <button
                          onClick={() => advanceQueueToken(item.token, 'completed')}
                          className="text-xs font-medium text-emerald-700 hover:text-emerald-900 cursor-pointer"
                        >
                          Mark Completed ✓
                        </button>
                      )}
                      {item.stage === 'completed' && (
                        <span className="text-[11px] text-slate-400">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 2. Patient Registration Form (Screen 11)
  if (activeTab === 'Patients') {
    return (
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Register Walk-in Patient
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Demographic capture and unique alphanumeric Patient ID generation
          </p>
        </div>

        {/* Stepper Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              formStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>1</span>
            <span className="font-semibold text-slate-900">Identity</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-100 text-slate-400">2</span>
            <span className="text-slate-400 font-medium">Contact</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-100 text-slate-400">3</span>
            <span className="text-slate-400 font-medium">Token</span>
          </div>
        </div>

        {generatedId && (
          <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-semibold text-xs text-[#065F46]">Patient Registered Successfully</div>
                <div className="text-[11px] text-emerald-700">Patient ID generated and added to OPD queue:</div>
              </div>
            </div>
            <div className="font-mono text-xs font-bold text-[#065F46] bg-white px-2.5 py-1 rounded border border-[#A7F3D0]">
              {generatedId}
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
                placeholder="e.g. Astha Sharma"
                className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="date" 
                  value={dob} 
                  onChange={(e) => setDob(e.target.value)} 
                  required 
                  max="2026-09-29"
                  className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Gender
                </label>
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mobile Number (10 digits) <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="tel" 
                  value={mobile} 
                  onChange={(e) => setMobile(e.target.value)} 
                  pattern="[0-9]{10}"
                  required 
                  placeholder="9876543210"
                  className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  OPD Department
                </label>
                <select 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option>General Medicine</option>
                  <option>Cardiology</option>
                  <option>Orthopedics</option>
                  <option>Pathology</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Residential Address
              </label>
              <textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                rows="2" 
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Auto-generates sequential queue token upon completion
              </span>
              <button 
                type="submit" 
                className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Save & Generate Patient ID
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 3. Live Patient Queue (Screen 12)
  if (activeTab === 'Queue') {
    const waitingTokens = queue.filter(q => q.stage === 'waiting');
    const inConsultTokens = queue.filter(q => q.stage === 'in_consultation');
    const completedTokens = queue.filter(q => q.stage === 'completed');

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Live Patient Queue (General Medicine)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Move patients through consultation stages: Waiting &rarr; In Consultation &rarr; Completed
            </p>
          </div>
          <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full">
            {waitingTokens.length} patients waiting
          </span>
        </div>

        {/* 3-Column Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* Column 1: Waiting */}
          <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200/80 min-h-[440px]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-800 text-xs">Waiting for Doctor</h2>
              <span className="text-[11px] font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                {waitingTokens.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {waitingTokens.map(token => (
                <div 
                  key={token.token}
                  className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs hover:border-blue-400 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-amber-800 bg-[#FFFBEB] px-1.5 py-0.5 rounded border border-[#FDE68A]">
                      {token.token}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{token.time}</span>
                  </div>
                  <div className="font-semibold text-slate-900 text-xs">{token.patient}</div>
                  <div className="text-[11px] font-mono text-slate-400">{token.patientId}</div>
                  <button 
                    onClick={() => advanceQueueToken(token.token, 'in_consultation')}
                    className="mt-2.5 w-full py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] rounded border border-blue-200/60 transition-colors cursor-pointer"
                  >
                    Send to Doctor &rarr;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: In Consultation */}
          <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-200/70 min-h-[440px]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-blue-900 text-xs">In Consultation</h2>
              <span className="text-[11px] font-mono font-bold bg-white text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                {inConsultTokens.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {inConsultTokens.map(token => (
                <div 
                  key={token.token}
                  className="bg-white p-3.5 rounded-lg border border-blue-300 shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded">
                      {token.token}
                    </span>
                    <span className="text-[10px] font-semibold text-blue-600">● Active</span>
                  </div>
                  <div className="font-semibold text-slate-900 text-xs">{token.patient}</div>
                  <div className="text-[11px] font-mono text-slate-400">{token.patientId}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Dr. Amit Sharma</div>
                  <button 
                    onClick={() => advanceQueueToken(token.token, 'completed')}
                    className="mt-2.5 w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded shadow-2xs transition-colors cursor-pointer"
                  >
                    Mark Consultation Done ✓
                  </button>
                </div>
              ))}
              {inConsultTokens.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-400">
                  Physician ready for next patient
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200/80 min-h-[440px]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-800 text-xs">Completed Today</h2>
              <span className="text-[11px] font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                {completedTokens.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {completedTokens.map(token => (
                <div 
                  key={token.token}
                  className="bg-white/80 p-3 rounded-lg border border-slate-200 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-semibold text-slate-600">{token.token}</span>
                    <span className="text-[10px] text-[#065F46] font-medium bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                      Completed
                    </span>
                  </div>
                  <div className="font-medium text-slate-800">{token.patient}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Ward & Bed Availability Overview (Screen 13)
  if (activeTab === 'Ward / Bed') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Ward & Bed Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Reception visibility for admission coordination and emergency triage
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Beds</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{totalBeds}</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Occupied Beds</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{occupiedBeds}</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Available Beds</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">{availableBeds}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Ward</th>
                <th className="py-3 px-5">Bed Identifier</th>
                <th className="py-3 px-5">Admitted Patient</th>
                <th className="py-3 px-5">Occupancy Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wards.flatMap(w => w.beds).map((b) => (
                <tr key={b.bedId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-5 font-medium text-slate-800 text-xs">General Ward A</td>
                  <td className="py-3 px-5 font-mono font-bold text-slate-900 text-xs">{b.bedId}</td>
                  <td className="py-3 px-5 text-slate-600 text-xs">
                    {b.patientName ? `${b.patientName} (${b.patientId})` : '—'}
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      b.status === 'Occupied' 
                        ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]' 
                        : 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 5. Appointments List
  if (activeTab === 'Appointments') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Confirmed Appointments Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage confirmed OPD appointments and time slot triage
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Scheduled Time</th>
                <th className="py-3 px-5">Patient Name</th>
                <th className="py-3 px-5">Attending Doctor</th>
                <th className="py-3 px-5">Department</th>
                <th className="py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 font-mono font-bold text-slate-900 text-xs">10:00 AM</td>
                <td className="py-3.5 px-5 font-semibold text-slate-800 text-xs">Astha Sharma (PID-PL00123)</td>
                <td className="py-3.5 px-5 text-slate-700 text-xs">Dr. Amit Sharma</td>
                <td className="py-3.5 px-5 text-slate-500 text-xs">General Medicine</td>
                <td className="py-3.5 px-5">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                    Confirmed
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 font-mono font-bold text-slate-900 text-xs">10:30 AM</td>
                <td className="py-3.5 px-5 font-semibold text-slate-800 text-xs">Rohan Verma (PID-PL00124)</td>
                <td className="py-3.5 px-5 text-slate-700 text-xs">Dr. Amit Sharma</td>
                <td className="py-3.5 px-5 text-slate-500 text-xs">General Medicine</td>
                <td className="py-3.5 px-5">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                    Waiting
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
};
