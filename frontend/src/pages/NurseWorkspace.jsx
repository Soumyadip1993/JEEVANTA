import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Bed, 
  Activity, 
  CheckCircle2, 
  Plus 
} from 'lucide-react';

export const NurseWorkspace = () => {
  const { 
    activeTab, 
    setActiveTab, 
    wards, 
    recordVitals, 
    admitPatientToBed, 
    dischargePatientFromBed, 
    showToast 
  } = useHospital();

  // Selected bed for vitals entry
  const [selectedBed, setSelectedBed] = useState(wards[0].beds[0]);
  const [temp, setTemp] = useState('98.6');
  const [bp, setBp] = useState('120/80');
  const [pulse, setPulse] = useState('72');
  const [notes, setNotes] = useState('Patient comfortable, afebrile, and resting peacefully.');

  // Admission state
  const [admitPatientName, setAdmitPatientName] = useState('Ramesh Patel');
  const [admitPatientId, setAdmitPatientId] = useState('PID-PL00124');
  const [admitDiagnosis, setAdmitDiagnosis] = useState('Acute Bronchitis observation');
  const [admitWard, setAdmitWard] = useState('WARD-A');
  const [admitBedId, setAdmitBedId] = useState('Bed A-103');

  // Discharge preview state
  const [dischargeTargetBed, setDischargeTargetBed] = useState('Bed A-101');

  const handleSaveVitals = (e) => {
    e.preventDefault();
    const tempNum = parseFloat(temp);
    if (isNaN(tempNum) || tempNum < 90 || tempNum > 110) {
      showToast('Validation Error: Temperature must be between 90.0°F and 110.0°F', 'error');
      return;
    }
    if (!/^\d{2,3}\/\d{2,3}$/.test(bp)) {
      showToast('Validation Error: Blood Pressure must follow NNN/NN format (e.g. 120/80)', 'error');
      return;
    }

    recordVitals({
      bedId: selectedBed.bedId,
      patientName: selectedBed.patientName || 'Admitted Patient',
      temperature: tempNum,
      bp: bp,
      pulse: pulse,
      notes: notes
    });
    showToast(`Vitals successfully recorded for ${selectedBed.bedId}!`);
  };

  const handleAdmit = (e) => {
    e.preventDefault();
    admitPatientToBed(admitWard, admitBedId, admitPatientName, admitPatientId, admitDiagnosis);
  };

  const handleDischarge = (bedId) => {
    dischargePatientFromBed('WARD-A', bedId);
  };

  const totalBeds = wards.reduce((acc, w) => acc + w.totalBeds, 0);
  const occupiedBeds = wards.reduce((acc, w) => acc + w.occupied, 0);
  const availableBeds = totalBeds - occupiedBeds;

  // 1. Ward & Vitals Dashboard
  if (activeTab === 'Dashboard' || activeTab === 'Ward') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Ward & Inpatient Care Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Nurse Priya Nair • Station General Ward A & Observation Unit
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Occupied Beds</span>
              <Bed className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">{occupiedBeds}</div>
            <div className="mt-1 text-[11px] text-slate-400">Total hospital admissions</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Available Beds</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-700 tabular-nums">{availableBeds}</div>
            <div className="mt-1 text-[11px] text-emerald-700 font-medium">Vacant for triage admission</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Vitals Due</span>
              <Activity className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">7</div>
            <div className="mt-1 text-[11px] text-amber-800 font-medium">Scheduled round in 30 mins</div>
          </div>
        </div>

        {/* Bed Grid for Ward A */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Ward A • Bed Status Grid</h2>
              <p className="text-xs text-slate-400 mt-0.5">Select any occupied bed to view or log patient vitals</p>
            </div>
            <button 
              onClick={() => setActiveTab('Admission / Bed')}
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Admit Patient</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {wards[0].beds.map((b) => {
              const isOccupied = b.status === 'Occupied';
              return (
                <div
                  key={b.bedId}
                  onClick={() => {
                    setSelectedBed(b);
                    setActiveTab('Vitals');
                  }}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
                    isOccupied 
                      ? 'border-slate-200 bg-white hover:border-blue-400 shadow-2xs' 
                      : 'border-dashed border-slate-200 bg-slate-50/60 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{b.bedId}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      isOccupied 
                        ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]' 
                        : 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                    }`}>
                      {isOccupied ? 'Occupied' : 'Free'}
                    </span>
                  </div>
                  <div>
                    {isOccupied ? (
                      <>
                        <div className="text-xs font-semibold text-slate-900 truncate">{b.patientName}</div>
                        <div className="text-[11px] font-mono text-slate-400 truncate">{b.patientId}</div>
                      </>
                    ) : (
                      <div className="text-[11px] text-slate-400 font-medium">Available</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 2. Patient Vitals Entry Form
  if (activeTab === 'Vitals') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Patient Physiological Vitals Recording
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record observations without leaving the ward station screen
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Pane: Admitted Patient Details */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Bed</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {selectedBed.patientName || 'Astha Sharma'}
                </div>
                <div className="text-xs font-mono font-semibold text-blue-600 mt-0.5">
                  {selectedBed.bedId} • General Ward A
                </div>
              </div>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                selectedBed.status === 'Occupied' 
                  ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]' 
                  : 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
              }`}>
                {selectedBed.status}
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-600 mb-2">Last Recorded Vitals:</div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="font-medium text-slate-800">14 Sep 2026 • 08:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Temperature:</span>
                  <span className="font-bold text-slate-900 font-mono">98.6 °F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Blood Pressure:</span>
                  <span className="font-bold text-slate-900 font-mono">120/80 mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Attending Nurse:</span>
                  <span className="text-slate-700">Priya Nair</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed">
              Vitals are stored with timestamps and linked directly to active hospital admission records.
            </div>
          </div>

          {/* Right Pane: Vitals Entry Form */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Enter Current Observations
            </h2>

            <form onSubmit={handleSaveVitals} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Body Temperature (°F) <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="90"
                    max="110"
                    value={temp} 
                    onChange={(e) => setTemp(e.target.value)} 
                    required 
                    placeholder="98.6"
                    className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Normal range: 97.0°F - 99.5°F</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Blood Pressure (mmHg) <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={bp} 
                    onChange={(e) => setBp(e.target.value)} 
                    required 
                    placeholder="120/80"
                    className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Format: NNN/NN (e.g. 120/80)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pulse Rate (BPM)
                </label>
                <input 
                  type="number" 
                  value={pulse} 
                  onChange={(e) => setPulse(e.target.value)} 
                  placeholder="72"
                  className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Clinical Nursing Observations
                </label>
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  rows="2" 
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit" 
                  className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Save Vitals to EMR
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 3. Admission & Bed Management
  if (activeTab === 'Admission / Bed' || activeTab === 'Patients') {
    const vacantBeds = wards[0].beds.filter(b => b.status === 'Free');

    return (
      <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Admission & Bed Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inpatient journey: Admit &rarr; Assign Vacant Bed &rarr; Care &rarr; Discharge
          </p>
        </div>

        {/* Admission Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Admit Patient & Assign Bed
          </h2>

          <form onSubmit={handleAdmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Patient Full Name
                </label>
                <input 
                  type="text" 
                  value={admitPatientName} 
                  onChange={(e) => setAdmitPatientName(e.target.value)}
                  className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Patient ID
                </label>
                <input 
                  type="text" 
                  value={admitPatientId} 
                  onChange={(e) => setAdmitPatientId(e.target.value)}
                  className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Inpatient Ward
                </label>
                <select 
                  value={admitWard} 
                  onChange={(e) => setAdmitWard(e.target.value)}
                  className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="WARD-A">General Ward A</option>
                  <option value="WARD-B">Observation Ward</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Select Vacant Bed
                </label>
                <select 
                  value={admitBedId} 
                  onChange={(e) => setAdmitBedId(e.target.value)}
                  className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-semibold"
                >
                  {vacantBeds.map(b => (
                    <option key={b.bedId} value={b.bedId}>{b.bedId} (Vacant)</option>
                  ))}
                  {vacantBeds.length === 0 && <option disabled>No vacant beds in this ward</option>}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Admitting Diagnosis
              </label>
              <input 
                type="text" 
                value={admitDiagnosis} 
                onChange={(e) => setAdmitDiagnosis(e.target.value)}
                className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit"
                disabled={vacantBeds.length === 0}
                className="h-10 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Confirm Admission & Reserve Bed
              </button>
            </div>
          </form>
        </div>

        {/* Discharge Bed Workflow */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h2 className="text-sm font-bold text-slate-900">
              Discharge & Bed Availability Release
            </h2>
            <span className="text-xs text-slate-400">
              Releases bed back to Available status
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Select Bed to Discharge
              </label>
              <select 
                value={dischargeTargetBed}
                onChange={(e) => setDischargeTargetBed(e.target.value)}
                className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs bg-white font-mono font-medium"
              >
                {wards[0].beds.filter(b => b.status === 'Occupied').map(b => (
                  <option key={b.bedId} value={b.bedId}>
                    {b.bedId} — {b.patientName} ({b.diagnosis})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-5">
              <button 
                type="button"
                onClick={() => handleDischarge(dischargeTargetBed)}
                className="h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Confirm Discharge
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
