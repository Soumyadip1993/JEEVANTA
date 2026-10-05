import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Users, 
  FlaskConical, 
  Pill, 
  Plus, 
  Trash2, 
  Send 
} from 'lucide-react';

export const DoctorWorkspace = () => {
  const { 
    activeTab, 
    setActiveTab, 
    primaryPatient, 
    clinicalTimeline, 
    saveConsultation, 
    createPrescription, 
    labReports,
    showToast 
  } = useHospital();

  const [timeframe, setTimeframe] = useState('Today');

  const doctorScheduleExpanded = [
    { name: 'Astha Sharma', id: 'PID-PL00123', time: '10:00 AM', date: '10 Nov', complaint: 'Fever for 2 days', isPrimary: true },
    { name: 'Rohan Verma', id: 'PID-PL00124', time: '10:30 AM', date: '10 Nov', complaint: 'Hypertension evaluation', isPrimary: false },
    { name: 'Kavita Nair', id: 'PID-PL00129', time: '11:15 AM', date: '09 Nov', complaint: 'Routine follow-up', isPrimary: false },
    { name: 'Manoj Gupta', id: 'PID-PL00130', time: '02:00 PM', date: '08 Nov', complaint: 'Diabetes mellitus check', isPrimary: false },
    { name: 'Sunita Sen', id: 'PID-PL00131', time: '09:30 AM', date: '07 Nov', complaint: 'Seasonal cough & allergy', isPrimary: false },
    { name: 'Rajesh Varma', id: 'PID-PL00132', time: '04:15 PM', date: '06 Nov', complaint: 'Annual executive review', isPrimary: false },
    { name: 'Deepa Joshi', id: 'PID-PL00133', time: '10:45 AM', date: '05 Nov', complaint: 'Gastroenteritis symptoms', isPrimary: false },
    { name: 'Pooja Iyer', id: 'PID-PL00135', time: '03:00 PM', date: '02 Nov', complaint: 'Thyroid panel review', isPrimary: false },
    { name: 'Vikram Singhania', id: 'PID-PL00136', time: '11:30 AM', date: '29 Oct', complaint: 'Chest congestion check', isPrimary: false },
    { name: 'Harish Chandra', id: 'PID-PL00138', time: '01:15 PM', date: '22 Oct', complaint: 'BP titration consultation', isPrimary: false }
  ];

  const visibleSchedule = timeframe === 'Today' 
    ? doctorScheduleExpanded.slice(0, 2) 
    : timeframe === 'Week' 
    ? doctorScheduleExpanded.slice(0, 7) 
    : doctorScheduleExpanded;

  const doctorScaleMultiplier = timeframe === 'Week' ? 6 : timeframe === 'Month' ? 24 : 1;

  // Consultation state (Split-Screen, Screen 16)
  const [chiefComplaint, setChiefComplaint] = useState('Fever for 2 days, persistent mild headache and body ache');
  const [diagnosis, setDiagnosis] = useState('Acute viral pyrexia with upper respiratory symptoms');
  const [clinicalNotes, setClinicalNotes] = useState('Advised hydration, 3-day bed rest, and symptomatic antipyretic medication. Follow-up if temperature exceeds 101°F.');
  const [selectedLabTests, setSelectedLabTests] = useState(['CBC']);

  // Prescription builder state (Screen 18)
  const [prescriptionItems, setPrescriptionItems] = useState([
    { name: 'Paracetamol 650mg', dose: '1 tablet', frequency: 'Twice daily', duration: '5 days', quantity: 10 },
    { name: 'Cetirizine 10mg', dose: '1 tablet', frequency: 'Once daily', duration: '5 days', quantity: 5 },
    { name: 'Pantoprazole 40mg', dose: '1 tablet', frequency: 'Once daily (before meals)', duration: '5 days', quantity: 5 }
  ]);
  const [prescriptionInstructions, setPrescriptionInstructions] = useState('Take medicines strictly after meals with plenty of warm water.');

  const toggleLabTest = (testName) => {
    setSelectedLabTests(prev => 
      prev.includes(testName) ? prev.filter(t => t !== testName) : [...prev, testName]
    );
  };

  const handleSaveConsultation = (e) => {
    e.preventDefault();
    saveConsultation({
      patientId: primaryPatient.id,
      chiefComplaint,
      diagnosis,
      notes: clinicalNotes,
      requestedLabTests: selectedLabTests
    });
    showToast('Consultation saved! EMR updated and lab requests dispatched.');
  };

  const addPrescriptionRow = () => {
    setPrescriptionItems(prev => [
      ...prev,
      { name: '', dose: '1 tablet', frequency: 'Twice daily', duration: '5 days', quantity: 10 }
    ]);
  };

  const removePrescriptionRow = (index) => {
    if (prescriptionItems.length > 1) {
      setPrescriptionItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updatePrescriptionItem = (index, field, value) => {
    setPrescriptionItems(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSendPrescriptionToPharmacy = () => {
    if (prescriptionItems.some(i => !i.name.trim() || i.quantity < 1)) {
      showToast('Please specify valid medicine name and quantity', 'error');
      return;
    }
    createPrescription({
      patientId: primaryPatient.id,
      patientName: primaryPatient.name,
      items: prescriptionItems,
      instructions: prescriptionInstructions
    });
  };

  // 1. Clinical Dashboard
  if (activeTab === 'Dashboard') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Clinical Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Dr. Amit Sharma (MD) • Department of General Medicine • OPD Station 4
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200">
            {['Today', 'Week', 'Month'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeframe(tab)}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer text-xs font-semibold ${
                  timeframe === tab
                    ? 'bg-[#163956] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Focused Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>{timeframe === 'Today' ? "Today's Patients" : timeframe === 'Week' ? "This Week's Patients" : "This Month's Patients"}</span>
              <Users className="w-4 h-4 text-[#163956]" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
              {(16 * doctorScaleMultiplier).toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {timeframe === 'Today' ? '8 completed • 8 in queue' : timeframe === 'Week' ? '92 completed • 4 in queue' : '376 completed • 8 in queue'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>{timeframe === 'Today' ? "Pending Lab Results" : timeframe === 'Week' ? "Weekly Lab Reviews" : "Monthly Lab Reviews"}</span>
              <FlaskConical className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
              {(4 * doctorScaleMultiplier).toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-amber-700 font-medium">
              {timeframe === 'Today' ? 'Pathology lab processing' : 'Aggregated diagnostic test reviews'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>{timeframe === 'Today' ? "Prescriptions Issued" : timeframe === 'Week' ? "Weekly Prescriptions" : "Monthly Prescriptions"}</span>
              <Pill className="w-4 h-4 text-[#163956]" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
              {(8 * doctorScaleMultiplier).toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-emerald-700 font-medium">
              {timeframe === 'Today' ? 'Synced with central pharmacy' : 'Dispensed via central pharmacy formulary'}
            </div>
          </div>
        </div>

        {/* Patient Load Trend & Priority Action Items */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-1">OPD Consultation Load Trend</h2>
            <p className="text-xs text-slate-400 mb-4">Hourly patient flow distribution during morning consultation rounds</p>
            
            <div className="w-full h-44 flex items-center justify-center">
              <svg viewBox="0 0 500 180" className="w-full h-full">
                <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1.5" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1.5" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1.5" />
                <polyline 
                  fill="none" 
                  stroke="#2563eb" 
                  strokeWidth="2.5" 
                  points="20,130 80,95 160,105 240,60 320,70 400,30 480,45" 
                />
                <circle cx="20" cy="130" r="4" fill="#2563eb" />
                <circle cx="80" cy="95" r="4" fill="#2563eb" />
                <circle cx="160" cy="105" r="4" fill="#2563eb" />
                <circle cx="240" cy="60" r="4" fill="#2563eb" />
                <circle cx="320" cy="70" r="4" fill="#2563eb" />
                <circle cx="400" cy="30" r="4" fill="#2563eb" />
                <circle cx="480" cy="45" r="4" fill="#2563eb" />
              </svg>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1 px-2">
              <span>09:00</span><span>10:00</span><span>11:00</span><span>12:00</span><span>13:00</span><span>14:00</span><span>15:00</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 mb-2">Priority Action Items</h2>
            
            <div 
              onClick={() => setActiveTab('EMR / Consultation')}
              className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-200/70 hover:border-blue-300 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-xs text-slate-900">Astha Sharma (PID-PL00123)</div>
                <div className="text-[11px] text-blue-700 mt-0.5">Ready in consultation room • Fever 2 days</div>
              </div>
              <button className="h-7 px-2.5 bg-blue-600 text-white text-[11px] font-medium rounded shadow-2xs cursor-pointer">
                Consult &rarr;
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div>
                <div className="font-semibold text-xs text-slate-800">3 Pathology Reports Ready</div>
                <div className="text-[11px] text-slate-500 mt-0.5">CBC & Lipid profiles available for review</div>
              </div>
              <button 
                onClick={() => setActiveTab('Lab Requests')}
                className="h-7 px-2.5 bg-white border border-slate-300 rounded text-[11px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Review
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div>
                <div className="font-semibold text-xs text-slate-800">Inpatient Ward Bed A-101</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Ramesh Patel recovering satisfactorily</div>
              </div>
              <span className="text-[10px] text-[#065F46] font-medium bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                Stable
              </span>
            </div>
          </div>
        </div>

        {/* Consultations List with Timeframe Expansion */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {timeframe === 'Today' ? "Doctor's OPD Schedule (Today)" : timeframe === 'Week' ? "Doctor's OPD Schedule (Past 7 Days)" : "Doctor's OPD Schedule (Past 30 Days)"}
              </h2>
              <span className="text-xs text-slate-400">
                {timeframe === 'Today' ? 'Showing confirmed consult queue' : 'Aggregated consultation records'}
              </span>
            </div>
            <span className="text-xs font-semibold text-[#163956] bg-blue-50 px-3 py-1 rounded-lg">
              {visibleSchedule.length} appointments
            </span>
          </div>

          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Patient Name</th>
                <th className="py-3 px-5">Patient ID</th>
                <th className="py-3 px-5">{timeframe === 'Today' ? 'Time' : 'Date & Time'}</th>
                <th className="py-3 px-5">Chief Complaint</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleSchedule.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-slate-900 text-xs">{item.name}</td>
                  <td className="py-3.5 px-5 font-mono text-[11px] text-slate-400">{item.id}</td>
                  <td className="py-3.5 px-5 font-mono text-xs text-[#163956] font-bold">
                    {timeframe === 'Today' ? item.time : `${item.date} • ${item.time}`}
                  </td>
                  <td className="py-3.5 px-5 text-slate-600 text-xs">{item.complaint}</td>
                  <td className="py-3.5 px-5 text-right">
                    <button 
                      onClick={() => setActiveTab('EMR / Consultation')}
                      className={`h-8 px-3 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        item.isPrimary 
                          ? 'bg-[#163956] hover:bg-[#102a40] text-white shadow-xs' 
                          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      Open Consultation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 2. Consultation Workspace: Split-Screen Layout (Screen 16)
  if (activeTab === 'EMR / Consultation') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Consultation Workspace (Split-Pane EMR)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical health records remain visible on the left while recording current diagnosis on the right
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('Prescriptions')}
            className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Create Prescription</span>
          </button>
        </div>

        {/* Split Screen Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Pane: Historical EMR Timeline (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                {primaryPatient.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">{primaryPatient.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                    {primaryPatient.id}
                  </span>
                  <span className="text-xs text-slate-500">{primaryPatient.age}y • {primaryPatient.gender}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Historical Consultations & EMR
              </div>
              <div className="space-y-3.5 relative pl-4 before:content-[''] before:absolute before:left-1 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                {clinicalTimeline.map((item) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-[18px] top-1.5 w-2 h-2 rounded-full bg-blue-600"></div>
                    <div className="text-[10px] font-medium text-slate-400">{item.date} • {item.type}</div>
                    <div className="text-xs font-semibold text-slate-800">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.notes}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-700 mb-2">Patient Vitals:</div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400">Temp</div>
                  <div className="font-bold text-slate-800 font-mono">98.6°F</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400">BP</div>
                  <div className="font-bold text-slate-800 font-mono">120/80</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400">Blood</div>
                  <div className="font-bold text-rose-600 font-mono">B+</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Pane: Current Consultation & Lab Orders (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-5">
            <form onSubmit={handleSaveConsultation} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Chief Complaint / Observed Symptoms <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  required
                  className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Clinical Diagnosis <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                  className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Clinical Advice & Examination Notes
                </label>
                <textarea 
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  rows="3"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Lab Test Requests Checklist */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Request Diagnostic Tests
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-medium">
                  {['CBC', 'Lipid Profile', 'Blood Sugar', 'Urine Routine'].map(test => {
                    const isChecked = selectedLabTests.includes(test);
                    return (
                      <label 
                        key={test} 
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer ${
                          isChecked 
                            ? 'border-blue-300 bg-blue-50 text-blue-900 font-semibold' 
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => toggleLabTest(test)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>{test}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Saves consultation to EMR and updates queue
                </span>
                <div className="flex gap-2.5">
                  <button 
                    type="submit"
                    className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    Save Consultation
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('Prescriptions')}
                    className="h-9 px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition-colors cursor-pointer"
                  >
                    Create Prescription &rarr;
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 3. Dynamic Prescription Builder (Screen 18)
  if (activeTab === 'Prescriptions') {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Create Digital Prescription
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Add medicines with doses, frequencies and forward directly to central pharmacy
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              Patient: {primaryPatient.name} ({primaryPatient.id})
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Prescription Line Items
            </h2>
            <button
              type="button"
              onClick={addPrescriptionRow}
              className="h-8 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-medium border border-blue-200/60 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medicine</span>
            </button>
          </div>

          {/* Dynamic Table */}
          <div className="space-y-2.5 mb-5">
            {prescriptionItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    placeholder="e.g. Paracetamol 650mg"
                    onChange={(e) => updatePrescriptionItem(idx, 'name', e.target.value)}
                    className="w-full px-2.5 h-8 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="w-28">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Dose
                  </label>
                  <input
                    type="text"
                    value={item.dose}
                    placeholder="1 tablet"
                    onChange={(e) => updatePrescriptionItem(idx, 'dose', e.target.value)}
                    className="w-full px-2.5 h-8 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="w-28">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Frequency
                  </label>
                  <input
                    type="text"
                    value={item.frequency}
                    placeholder="Twice daily"
                    onChange={(e) => updatePrescriptionItem(idx, 'frequency', e.target.value)}
                    className="w-full px-2.5 h-8 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="w-24">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={item.duration}
                    placeholder="5 days"
                    onChange={(e) => updatePrescriptionItem(idx, 'duration', e.target.value)}
                    className="w-full px-2.5 h-8 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="w-16">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updatePrescriptionItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-full px-2 h-8 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {prescriptionItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrescriptionRow(idx)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors mt-3.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              General Instructions for Patient
            </label>
            <textarea
              value={prescriptionInstructions}
              onChange={(e) => setPrescriptionInstructions(e.target.value)}
              rows="2"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => showToast('Prescription saved to local records.')}
              className="h-9 px-4 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
            >
              Save & Print Local Copy
            </button>

            <button
              type="button"
              onClick={handleSendPrescriptionToPharmacy}
              className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to Pharmacy Dispensing</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Lab Requests Status Tracker (Screen 17)
  if (activeTab === 'Lab Requests') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Laboratory Test Requests
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Diagnostic test orders forwarded to pathology laboratory
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Request ID</th>
                <th className="py-3 px-5">Patient Name</th>
                <th className="py-3 px-5">Diagnostic Test</th>
                <th className="py-3 px-5">Order Date</th>
                <th className="py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {labReports.map((lab) => (
                <tr key={lab.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900 text-xs">{lab.id}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-800 text-xs">{lab.patientName}</td>
                  <td className="py-3.5 px-5 text-slate-700 text-xs font-medium">{lab.test}</td>
                  <td className="py-3.5 px-5 text-slate-400 text-xs font-mono">{lab.requestDate}</td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      lab.status === 'Completed' 
                        ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' 
                        : 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]'
                    }`}>
                      {lab.status}
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

  // 5. Patients List
  if (activeTab === 'Patients') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Consulted Patients Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review patient medical histories and open active consultations
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Patient Name</th>
                <th className="py-3 px-5">Patient ID</th>
                <th className="py-3 px-5">Department</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-slate-900 text-xs">Astha Sharma</td>
                <td className="py-3.5 px-5 font-mono text-[11px] text-slate-400">PID-PL00123</td>
                <td className="py-3.5 px-5 text-slate-600 text-xs">General Medicine</td>
                <td className="py-3.5 px-5 text-right">
                  <button 
                    onClick={() => setActiveTab('EMR / Consultation')}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    View EMR &rarr;
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-slate-900 text-xs">Rohan Verma</td>
                <td className="py-3.5 px-5 font-mono text-[11px] text-slate-400">PID-PL00124</td>
                <td className="py-3.5 px-5 text-slate-600 text-xs">General Medicine</td>
                <td className="py-3.5 px-5 text-right">
                  <button 
                    onClick={() => setActiveTab('EMR / Consultation')}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    View EMR &rarr;
                  </button>
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
