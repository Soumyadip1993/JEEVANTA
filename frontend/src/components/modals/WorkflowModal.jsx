import { useHospital } from '../../context/HospitalContext';
import { 
  X, 
  UserCheck, 
  CalendarClock, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  PackageCheck,
  Bed
} from 'lucide-react';

export const WorkflowModal = () => {
  const { showWorkflowModal, setShowWorkflowModal, setActiveTab, currentRole, isAuthorizedTab, showToast } = useHospital();

  if (!showWorkflowModal) return null;

  const outpatientSteps = [
    {
      num: '01',
      title: 'Register',
      sub: 'Patient ID generation',
      role: 'Receptionist',
      tab: 'Patients',
      color: 'border-blue-500 bg-blue-50 text-blue-700',
      icon: <UserCheck className="w-5 h-5" />
    },
    {
      num: '02',
      title: 'Book & Queue',
      sub: 'Time slot & token #',
      role: 'Receptionist',
      tab: 'Appointments',
      color: 'border-emerald-500 bg-emerald-50 text-emerald-700',
      icon: <CalendarClock className="w-5 h-5" />
    },
    {
      num: '03',
      title: 'Consult',
      sub: 'Split-screen EMR notes',
      role: 'Doctor',
      tab: 'OPD & Consultation',
      color: 'border-purple-500 bg-purple-50 text-purple-700',
      icon: <Stethoscope className="w-5 h-5" />
    },
    {
      num: '04',
      title: 'Lab Test',
      sub: 'Order & PDF upload',
      role: 'Laboratory Technician',
      tab: 'Laboratory',
      color: 'border-amber-500 bg-amber-50 text-amber-700',
      icon: <FlaskConical className="w-5 h-5" />
    },
    {
      num: '05',
      title: 'Prescribe',
      sub: 'Multi-item Rx builder',
      role: 'Doctor',
      tab: 'OPD & Consultation',
      color: 'border-teal-500 bg-teal-50 text-teal-700',
      icon: <Pill className="w-5 h-5" />
    },
    {
      num: '06',
      title: 'Dispense',
      sub: 'Atomic stock deduction',
      role: 'Pharmacist',
      tab: 'Pharmacy',
      color: 'border-rose-500 bg-rose-50 text-rose-700',
      icon: <PackageCheck className="w-5 h-5" />
    }
  ];

  const inpatientSteps = [
    { title: 'Admission', desc: 'Authorized by Physician' },
    { title: 'Ward Selection', desc: 'General Ward A or Observation' },
    { title: 'Bed Assignment', desc: 'Allocates vacant bed (Free → Occupied)' },
    { title: 'Vitals & Care', desc: 'Nurse logs Temp, BP, Pulse' },
    { title: 'Discharge', desc: 'Bed released back to Available' }
  ];

  const handleStepJump = (role, tab) => {
    if (role === currentRole && isAuthorizedTab(tab)) {
      setActiveTab(tab);
      setShowWorkflowModal(false);
    } else {
      showToast(`Restricted Access: Sign out and authenticate as ${role} to access this workspace.`, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full p-6 sm:p-12 max-h-[92vh] overflow-y-auto space-y-8">
        <div className="flex items-start justify-between border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <span>✚ JEEVANTA CLINICAL SPECIFICATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1.5 leading-snug">
              Integrated Hospital Workflow
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2 leading-relaxed">
              All refined modules connect into one coherent Government Hospital Management System.
            </p>
          </div>
          <button 
            onClick={() => setShowWorkflowModal(false)}
            className="p-2.5 text-slate-400 hover:text-slate-700 rounded-2xl hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Outpatient Patient Journey */}
        <div>
          <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-700 mb-4 flex flex-wrap items-center gap-2">
            <span>Primary Outpatient Journey</span>
            <span className="text-xs font-normal text-slate-400 normal-case">(Click any step to test that screen)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {outpatientSteps.map((s, idx) => (
              <div 
                key={idx}
                onClick={() => handleStepJump(s.role, s.tab)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${s.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold opacity-75">{s.num}</span>
                    {s.icon}
                  </div>
                  <div className="font-bold text-slate-900 text-sm sm:text-base">{s.title}</div>
                  <div className="text-xs text-slate-600 mt-1.5 leading-relaxed">{s.sub}</div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-200/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {s.role} &rarr;
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inpatient Bed & Ward Journey */}
        <div className="p-6 sm:p-8 bg-slate-50/80 rounded-3xl border border-slate-200">
          <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
            <Bed className="w-5 h-5 text-blue-600" />
            <span>Inpatient Bed Lifecycle</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {inpatientSteps.map((step, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  if (isAuthorizedTab('Inpatient / Wards')) {
                    setActiveTab('Inpatient / Wards');
                    setShowWorkflowModal(false);
                    showToast(`Navigated to Inpatient / Wards: ${step.title}`);
                  } else {
                    showToast(`Restricted Access: Inpatient / Wards is authorized for clinical and ward staff.`, 'error');
                  }
                }}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all"
              >
                <span className="font-bold text-slate-900 text-sm block mb-1">{step.title}</span>
                <span className="text-xs text-slate-500 leading-relaxed block">{step.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture & Data Stores Alignment */}
        <div className="border-t border-slate-200 pt-5 text-xs text-slate-500">
          <div className="font-semibold text-slate-800 mb-2">
            System Architecture Alignment (3-Tier & 3NF ERD):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-2xs text-slate-600">
            <div className="p-2 rounded bg-slate-100">D1: Patient Database</div>
            <div className="p-2 rounded bg-slate-100">D2: Appointment & Queue</div>
            <div className="p-2 rounded bg-slate-100">D3: EMR Clinical Records</div>
            <div className="p-2 rounded bg-slate-100">D4: Diagnostic Laboratory</div>
            <div className="p-2 rounded bg-slate-100">D5: Pharmacy Inventory</div>
            <div className="p-2 rounded bg-slate-100">D6: User Accounts & RBAC</div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => setShowWorkflowModal(false)}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            Close & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
