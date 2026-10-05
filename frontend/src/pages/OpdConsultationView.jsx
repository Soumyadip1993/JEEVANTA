import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { initialData } from '../data/mockDatabase';
import { 
  Plus, 
  Trash2,
  Stethoscope
} from 'lucide-react';

export const OpdConsultationView = () => {
  const { showToast, hasPermission } = useHospital();
  const [selectedPatient, setSelectedPatient] = useState('Ramesh Kumar');
  const [chiefComplaint, setChiefComplaint] = useState('Patient presents with recurrent mild fever, body aches, and dry cough for 3 days.');
  const [diagnosis, setDiagnosis] = useState('Acute upper respiratory viral infection');
  const [rxList, setRxList] = useState([
    { name: 'Paracetamol 650mg', dose: '1 tab', freq: 'Twice daily', days: '5 days' },
    { name: 'Cetirizine 10mg', dose: '1 tab', freq: 'At night', days: '5 days' }
  ]);
  const [newMed, setNewMed] = useState({ name: '', dose: '1 tab', freq: 'Twice daily', days: '3 days' });

  const addMed = () => {
    if (!newMed.name) return;
    setRxList([...rxList, newMed]);
    setNewMed({ name: '', dose: '1 tab', freq: 'Twice daily', days: '3 days' });
  };

  const removeMed = (index) => {
    setRxList(rxList.filter((_, i) => i !== index));
  };

  const handleFinish = (e) => {
    e.preventDefault();
    showToast(`Consultation finished for ${selectedPatient}. Prescription dispatched to pharmacy!`, 'success');
  };

  return (
    <div className="space-y-10 sm:space-y-12 pb-20 animate-fade-in max-w-7xl mx-auto text-slate-800">
      {/* Header with Generous Clearances */}
      <div className="pb-6 sm:pb-8 border-b border-slate-200/70">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 flex items-center gap-3.5 leading-snug">
          <Stethoscope className="w-8 h-8 text-blue-600 shrink-0" />
          <span>OPD & Clinical Consultation Workbench</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2.5 leading-relaxed">
          Dr. Ananya Sharma • Outpatient Clinic Room 4 (General Medicine) &bull; Integrated EMR & e-Prescription authoring
        </p>
      </div>

      {/* Main Grid with Wide Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
        {/* Left: Active OPD Patient Queue with Generous Padding */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Today's Triage Queue</h2>
              <p className="text-xs text-slate-400 mt-0.5">Select a patient to consult</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              5 in queue
            </span>
          </div>

          <div className="space-y-3.5">
            {initialData.todayAppointments.map((apt) => {
              const isSelected = selectedPatient === apt.name;
              return (
                <button
                  key={apt.id}
                  onClick={() => setSelectedPatient(apt.name)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/20' 
                      : 'border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm sm:text-base text-slate-900">{apt.name}</span>
                    <span className="text-xs font-mono text-slate-400">{apt.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 mt-2">
                    <span>{apt.type}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-medium text-xs ${apt.statusColor}`}>
                      {apt.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Clinical Consultation Stage with Ample Padding */}
        <div className="lg:col-span-2 bg-white p-8 sm:p-12 lg:p-14 rounded-3xl border border-slate-200/80 shadow-xs space-y-8 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-bold">Patient:</span>
                <span className="font-bold text-slate-900 text-lg sm:text-xl">{selectedPatient}</span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-mono font-medium border border-blue-200">
                  P1001
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 mt-2 flex flex-wrap items-center gap-3">
                <span>Vitals: BP 120/80 mmHg</span>
                <span>&bull;</span>
                <span>Pulse 72 bpm</span>
                <span>&bull;</span>
                <span>SpO2 98%</span>
                <span>&bull;</span>
                <span>Temp 98.6°F</span>
              </div>
            </div>
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
              In Active Consultation
            </span>
          </div>

          <form onSubmit={handleFinish} className="space-y-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Chief Clinical Complaint & Symptoms
              </label>
              <textarea
                rows={3}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full p-4 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Clinical Diagnosis
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full h-12 px-4 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Prescriptions authoring */}
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Digital Prescription (Items)
              </label>
              
              <div className="space-y-3">
                {rxList.map((rx, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-sm">
                    <div>
                      <span className="font-bold text-slate-900">{rx.name}</span>
                      <span className="text-slate-500 ml-3">&bull; {rx.dose}, {rx.freq} ({rx.days})</span>
                    </div>
                    {hasPermission('prescribe_medication') && (
                      <button
                        type="button"
                        onClick={() => removeMed(idx)}
                        className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer"
                        title="Remove medicine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add medication row with comfortable spacing - Clinician only */}
              {hasPermission('prescribe_medication') && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-3">
                  <input
                    type="text"
                    placeholder="Medicine name..."
                    value={newMed.name}
                    onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                    className="h-12 px-4 text-sm bg-white border border-slate-200 rounded-2xl sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 1 tab)"
                    value={newMed.dose}
                    onChange={(e) => setNewMed({...newMed, dose: e.target.value})}
                    className="h-12 px-4 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={addMed}
                    className="h-12 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Drug</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-100">
              {hasPermission('conduct_consultation') ? (
                <button
                  type="submit"
                  className="h-13 px-8 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl shadow-xs transition-colors cursor-pointer"
                >
                  Complete Consultation & Issue Rx
                </button>
              ) : (
                <span className="text-xs text-slate-400 font-medium italic">Read-only observation mode</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
