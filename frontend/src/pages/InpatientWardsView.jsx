import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { initialData } from '../data/mockDatabase';
import { 
  Bed, 
  UserPlus, 
  ChevronRight, 
  CheckCircle2
} from 'lucide-react';

export const InpatientWardsView = () => {
  const { showToast, setActiveTab, hasPermission } = useHospital();
  const [selectedWard, setSelectedWard] = useState('General Ward');

  const beds = initialData.wardBedList;
  const stats = initialData.wardStats;

  return (
    <div className="space-y-10 sm:space-y-12 pb-20 animate-fade-in max-w-6xl mx-auto text-slate-800">
      {/* Header with Generous Clearances */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-200/70">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 flex items-center gap-3.5 leading-snug">
            <Bed className="w-8 h-8 text-blue-600 shrink-0" />
            <span>Ward & Inpatient Bed Telemetry</span>
          </h1>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-500 mt-2">
            <span>Inpatient / Wards</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-slate-800 font-medium">{selectedWard}</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="h-12 px-4 text-sm bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium shadow-2xs cursor-pointer"
          >
            <option value="General Ward">General Ward</option>
            <option value="ICU">ICU (Intensive Care)</option>
            <option value="Maternity Ward">Maternity Ward</option>
            <option value="Pediatric Ward">Pediatric Ward</option>
          </select>

          {hasPermission('admit_patient') && (
            <button
              onClick={() => showToast({ type: 'info', message: 'The Inpatient Admission Bed Allocation module is currently under development.' })}
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Admit Patient</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Stat Tiles with Roomy Padding and Breathing Space */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Beds</span>
            <Bed className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums mt-3">{stats.totalBeds}</div>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Occupied</span>
            <Bed className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums mt-3">{stats.occupied}</div>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Available</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tabular-nums mt-3">{stats.available}</div>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Occupancy Rate</span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">High</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums mt-3">{stats.occupancyRate}%</div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3.5 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${stats.occupancyRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Bed Status & Inpatients Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Bed Status & Inpatients</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">{selectedWard} real-time census</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-6 px-8">Bed No.</th>
                <th className="py-6 px-8">Patient Name</th>
                <th className="py-6 px-8">Age / Gender</th>
                <th className="py-6 px-8">Condition</th>
                <th className="py-6 px-8">Status</th>
                <th className="py-6 px-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 leading-relaxed">
              {beds.map((b) => (
                <tr key={b.bedNo} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-6 px-8 font-mono font-bold text-slate-900">{b.bedNo}</td>
                  <td className="py-6 px-8 font-semibold text-slate-900">{b.patient}</td>
                  <td className="py-6 px-8 text-slate-600">{b.ageGender}</td>
                  <td className="py-6 px-8 text-slate-600">{b.condition}</td>
                  <td className="py-6 px-8">
                    <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-medium border ${
                      b.status === 'Occupied'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {hasPermission('record_vitals') && b.status === 'Occupied' && (
                        <button
                          onClick={() => showToast(`Recorded vitals for ${b.patient} at ${b.bedNo}`)}
                          className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Log Vitals
                        </button>
                      )}
                      {hasPermission('discharge_patient') && b.status === 'Occupied' && (
                        <button
                          onClick={() => showToast(`Discharge orders processed for ${b.patient}. Bed ${b.bedNo} marked for sanitization.`)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Discharge
                        </button>
                      )}
                      {hasPermission('view_patient_emr') && (
                        <button 
                          onClick={() => {
                            setActiveTab('Patients');
                            showToast(`Opened inpatient chart for ${b.patient}`);
                          }}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          View Chart
                        </button>
                      )}
                      {!hasPermission('view_patient_emr') && !hasPermission('record_vitals') && (
                        <span className="text-slate-400 text-xs font-mono">Telemetry Only</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
