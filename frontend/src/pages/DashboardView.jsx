import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { initialData } from '../data/mockDatabase';
import { 
  Users, 
  Calendar, 
  Bed, 
  FlaskConical, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  AlertTriangle,
  Activity,
  Pill,
  ShieldCheck,
  UserCheck,
  Stethoscope,
  FileText,
  ClipboardList,
  CheckCircle2,
  Download
} from 'lucide-react';

export const DashboardView = () => {
  const { currentRole, currentUser, setActiveTab, showToast, isAuthorizedTab, hasPermission } = useHospital();
  const [timeframe, setTimeframe] = useState('Today');

  // Helper to format greeting and title based on current actor
  const getActorMeta = () => {
    const name = currentUser?.name || 'Healthcare Professional';
    switch (currentRole) {
      case 'Doctor':
        return {
          greeting: `Good morning, ${name}`,
          roleBadge: 'Clinical Workspace • Doctor',
          subtitle: 'Your active patient queue, assigned consultation schedule, and diagnostic alerts.',
          badgeColor: 'bg-sky-50 text-sky-700 border-sky-200'
        };
      case 'Receptionist':
        return {
          greeting: `Good morning, ${name}`,
          roleBadge: 'Front Desk & Patient Services',
          subtitle: 'Live walk-in registrations, OPD queue token issuance, and schedule check-ins.',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'Nurse':
        return {
          greeting: `Good morning, ${name}`,
          roleBadge: 'Inpatient Ward Station & Nursing Care',
          subtitle: 'Real-time bed census, vital signs tracking schedule, and pending medication administrations.',
          badgeColor: 'bg-teal-50 text-teal-700 border-teal-200'
        };
      case 'Laboratory Technician':
        return {
          greeting: `Good morning, ${name}`,
          roleBadge: 'Diagnostic Pathology & Clinical Laboratory',
          subtitle: 'Specimen accessions, pending test benches, analyzer queues, and critical value reporting.',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      case 'Pharmacist':
        return {
          greeting: `Good morning, ${name}`,
          roleBadge: 'Central Hospital Pharmacy & Formulary',
          subtitle: 'Prescription dispensing queues, atomic inventory levels, and batch expiry tracking.',
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'Administrator':
        return {
          greeting: `Good morning, ${name}`,
          roleBadge: 'Medical Superintendent & Governance',
          subtitle: 'Hospital-wide operational capacity, clinical department KPIs, staff attendance, and security compliance.',
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
        };
      case 'Patient':
        return {
          greeting: `Welcome back, ${name}`,
          roleBadge: `Patient Health Portal • ID: ${currentUser?.id || 'P1001'}`,
          subtitle: 'Your personal health records, upcoming doctor visits, active medications, and diagnostic reports.',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      default:
        return {
          greeting: `Good morning, ${name}`,
          roleBadge: `${currentRole} Workspace`,
          subtitle: 'Authorized healthcare telemetry and operational overview.',
          badgeColor: 'bg-slate-50 text-slate-700 border-slate-200'
        };
    }
  };

  const actorMeta = getActorMeta();

  // 1. Role-specific 4 Metric Cards
  const getRoleMetrics = () => {
    switch (currentRole) {
      case 'Doctor':
        return [
          {
            title: 'Assigned Patients',
            value: '18',
            sub: '12 waiting • 2 in consult',
            subColor: 'text-emerald-600',
            icon: Users,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600'
          },
          {
            title: 'Pending Lab Reviews',
            value: '3',
            sub: '2 critical flags awaiting sign-off',
            subColor: 'text-rose-600 font-semibold',
            icon: FlaskConical,
            iconBg: 'bg-rose-50',
            iconColor: 'text-rose-600'
          },
          {
            title: 'Prescriptions Issued',
            value: '14',
            sub: 'Digital Rx active today',
            subColor: 'text-slate-500',
            icon: Pill,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600'
          },
          {
            title: 'My Admitted Care',
            value: '6',
            sub: 'Inpatients under Dr. Ananya',
            subColor: 'text-slate-500',
            icon: Bed,
            iconBg: 'bg-teal-50',
            iconColor: 'text-teal-600'
          }
        ];

      case 'Receptionist':
        return [
          {
            title: "Today's Check-ins",
            value: '64',
            sub: '+18% from morning average',
            subColor: 'text-emerald-600',
            icon: UserCheck,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600'
          },
          {
            title: 'Waiting in OPD Lobby',
            value: '14',
            sub: 'Avg wait time: 18 mins',
            subColor: 'text-amber-600',
            icon: Clock,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600'
          },
          {
            title: 'Tokens Issued Today',
            value: '88',
            sub: 'Across 4 active counters',
            subColor: 'text-slate-500',
            icon: ClipboardList,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600'
          },
          {
            title: 'Available Beds',
            value: '12',
            sub: 'Available for admission inquiry',
            subColor: 'text-emerald-600',
            icon: Bed,
            iconBg: 'bg-sky-50',
            iconColor: 'text-sky-600'
          }
        ];

      case 'Nurse':
        return [
          {
            title: 'Admitted Ward Patients',
            value: '28',
            sub: 'Ward A: 14 • Observation: 14',
            subColor: 'text-slate-500',
            icon: Users,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600'
          },
          {
            title: 'Scheduled Vitals Due',
            value: '7',
            sub: '10:00 AM round due now',
            subColor: 'text-rose-600 font-semibold',
            icon: Activity,
            iconBg: 'bg-rose-50',
            iconColor: 'text-rose-600'
          },
          {
            title: 'Available Beds (Ward A/B)',
            value: '10',
            sub: '6 in Ward A • 4 in Ward B',
            subColor: 'text-emerald-600',
            icon: Bed,
            iconBg: 'bg-teal-50',
            iconColor: 'text-teal-600'
          },
          {
            title: 'Scheduled Doses (Shift)',
            value: '12',
            sub: '4 Antibiotics • 8 Oral tablets',
            subColor: 'text-amber-600',
            icon: Pill,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600'
          }
        ];

      case 'Laboratory Technician':
        return [
          {
            title: 'Pending Test Orders',
            value: '16',
            sub: '8 CBC • 4 Lipid • 4 Sugar',
            subColor: 'text-amber-600',
            icon: FlaskConical,
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600'
          },
          {
            title: 'Samples in Accessioning',
            value: '9',
            sub: 'Awaiting analyzer run',
            subColor: 'text-slate-500',
            icon: Clock,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600'
          },
          {
            title: 'Reports Verified Today',
            value: '42',
            sub: '+15% laboratory throughput',
            subColor: 'text-emerald-600',
            icon: CheckCircle2,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600'
          },
          {
            title: 'Critical Panic Values',
            value: '2',
            sub: 'Urgent doctor alerts sent',
            subColor: 'text-rose-600 font-semibold',
            icon: AlertTriangle,
            iconBg: 'bg-rose-50',
            iconColor: 'text-rose-600'
          }
        ];

      case 'Pharmacist':
        return [
          {
            title: 'Pending Dispensation',
            value: '6',
            sub: 'Prescriptions in counter queue',
            subColor: 'text-amber-600 font-semibold',
            icon: Clock,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600'
          },
          {
            title: 'Dispensed Today',
            value: '74',
            sub: 'Orders fulfilled successfully',
            subColor: 'text-emerald-600',
            icon: Pill,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600'
          },
          {
            title: 'Low-Stock Medicines',
            value: '5',
            sub: 'Below reorder threshold',
            subColor: 'text-rose-600 font-semibold',
            icon: AlertTriangle,
            iconBg: 'bg-rose-50',
            iconColor: 'text-rose-600'
          },
          {
            title: 'Expiring Batches (<60d)',
            value: '3',
            sub: 'Quarantine or prioritize issue',
            subColor: 'text-amber-600',
            icon: Calendar,
            iconBg: 'bg-sky-50',
            iconColor: 'text-sky-600'
          }
        ];

      case 'Administrator':
        return [
          {
            title: 'Total Hospital Footfall',
            value: '176',
            sub: '128 OPD • 48 Inpatients',
            subColor: 'text-emerald-600',
            icon: Users,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600'
          },
          {
            title: 'Overall Bed Occupancy',
            value: '82%',
            sub: '164 / 200 total beds occupied',
            subColor: 'text-slate-500',
            icon: Bed,
            iconBg: 'bg-teal-50',
            iconColor: 'text-teal-600'
          },
          {
            title: 'Clinical Staff on Duty',
            value: '34',
            sub: 'Doctors, nurses & tech logged in',
            subColor: 'text-emerald-600',
            icon: Stethoscope,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600'
          },
          {
            title: 'System Compliance',
            value: '100%',
            sub: '0 security incidents • 542 logs',
            subColor: 'text-emerald-600',
            icon: ShieldCheck,
            iconBg: 'bg-indigo-50',
            iconColor: 'text-indigo-600'
          }
        ];

      case 'Patient':
        return [
          {
            title: 'Upcoming Visit',
            value: '1',
            sub: 'Dr. Amit Sharma • 10:30 AM',
            subColor: 'text-blue-600 font-semibold',
            icon: Calendar,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600'
          },
          {
            title: 'Active Medications',
            value: '2',
            sub: 'Ongoing prescription courses',
            subColor: 'text-emerald-600',
            icon: Pill,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600'
          },
          {
            title: 'Lab Reports Ready',
            value: '3',
            sub: 'Verified tests for download',
            subColor: 'text-purple-600 font-semibold',
            icon: FlaskConical,
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600'
          },
          {
            title: 'Consultations History',
            value: '4',
            sub: 'Past clinical visits recorded',
            subColor: 'text-slate-500',
            icon: FileText,
            iconBg: 'bg-teal-50',
            iconColor: 'text-teal-600'
          }
        ];

      default:
        return [
          {
            title: "Today's Activity",
            value: '36',
            sub: 'Operational tasks',
            subColor: 'text-slate-500',
            icon: Activity,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600'
          }
        ];
    }
  };

  // 2. Role-specific Quick Action Shortcuts with Dynamic Authorization Filtering
  const getRoleQuickActions = () => {
    let actions;
    switch (currentRole) {
      case 'Doctor':
        actions = [
          { label: 'Examine Next Patient', tab: 'OPD & Consultation', icon: Stethoscope },
          { label: 'View Patients Directory', tab: 'Patients', icon: Users },
          { label: 'Review Lab Requests', tab: 'Laboratory', icon: FlaskConical },
          { label: 'Inpatient Bed Rounds', tab: 'Inpatient / Wards', icon: Bed }
        ];
        break;
      case 'Receptionist':
        actions = [
          { label: 'Register New Patient', tab: 'Patients', icon: UserCheck },
          { label: 'Schedule Appointment', tab: 'Appointments', icon: Calendar },
          { label: 'Hospital Bed Inquiries', tab: 'Inpatient / Wards', icon: Bed },
          { label: 'Today’s OPD Appointments', tab: 'Appointments', icon: Clock }
        ];
        break;
      case 'Nurse':
        actions = [
          { label: 'Inpatient Wards Census', tab: 'Inpatient / Wards', icon: Bed },
          { label: 'View Admitted Patients', tab: 'Patients', icon: Users },
          { label: 'Emergency Ward Bed Check', tab: 'Inpatient / Wards', icon: Activity }
        ];
        break;
      case 'Laboratory Technician':
        actions = [
          { label: 'Lab Test Bench', tab: 'Laboratory', icon: FlaskConical },
          { label: 'Verify CBC Results', tab: 'Laboratory', icon: CheckCircle2 },
          { label: 'Patient Directory Lookup', tab: 'Patients', icon: Users },
          { label: 'Critical Panic Flagging', tab: 'Laboratory', icon: AlertTriangle }
        ];
        break;
      case 'Pharmacist':
        actions = [
          { label: 'Dispense Prescriptions', tab: 'Pharmacy', icon: Pill },
          { label: 'Check Stock Levels', tab: 'Pharmacy', icon: AlertTriangle },
          { label: 'Medicine Catalog Ledger', tab: 'Pharmacy', icon: FileText },
          { label: 'Patient Medication History', tab: 'Patients', icon: Users }
        ];
        break;
      case 'Administrator':
        actions = [
          { label: 'Executive Analytics', tab: 'Reports', icon: TrendingUp },
          { label: 'Staff Roles & RBAC', tab: 'Settings', icon: ShieldCheck },
          { label: 'Wards & Bed Capacity', tab: 'Inpatient / Wards', icon: Bed },
          { label: 'Pharmacy Restock Status', tab: 'Pharmacy', icon: Pill }
        ];
        break;
      case 'Patient':
        actions = [
          { label: 'Book Doctor Appointment', tab: 'Appointments', icon: Calendar },
          { label: 'Download Lab Reports', tab: 'Laboratory', icon: Download },
          { label: 'My Clinical History', tab: 'Patients', icon: FileText }
        ];
        break;
      default:
        actions = [];
    }
    return actions.filter(action => isAuthorizedTab(action.tab));
  };

  // 3. Role-specific Left Panel Content
  const renderLeftPanel = () => {
    switch (currentRole) {
      case 'Doctor':
        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Today's Consultation Queue</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Assigned outpatient triage queue for your room</p>
              </div>
              <button 
                onClick={() => setActiveTab('OPD & Consultation')}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer px-4 py-2 bg-blue-50 rounded-xl"
              >
                Open OPD Desk
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Token</th>
                    <th className="py-6 px-8">Patient Name</th>
                    <th className="py-6 px-8">Time</th>
                    <th className="py-6 px-8">Category</th>
                    <th className="py-6 px-8">Stage</th>
                    <th className="py-6 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {initialData.queue.map((item) => (
                    <tr key={item.token} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-6 px-8 font-mono font-bold text-blue-700">{item.token}</td>
                      <td className="py-6 px-8 font-bold text-slate-900">{item.patient}</td>
                      <td className="py-6 px-8 text-slate-500 tabular-nums">{item.time}</td>
                      <td className="py-6 px-8 text-slate-600">General OPD</td>
                      <td className="py-6 px-8">
                        <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold border ${
                          item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          item.status === 'In consultation' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button 
                          onClick={() => setActiveTab('OPD & Consultation')}
                          className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                        >
                          Consult
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Receptionist':
        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Today's Scheduled Appointments</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Patient check-in verification and desk triage</p>
              </div>
              <button 
                onClick={() => setActiveTab('Appointments')}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer px-4 py-2 bg-blue-50 rounded-xl"
              >
                All Bookings
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Time</th>
                    <th className="py-6 px-8">Patient Name</th>
                    <th className="py-6 px-8">Department</th>
                    <th className="py-6 px-8">Status</th>
                    <th className="py-6 px-8 text-right">Front Desk Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {initialData.todayAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-6 px-8 font-mono text-slate-900 font-semibold tabular-nums">{apt.time}</td>
                      <td className="py-6 px-8 font-bold text-slate-900">{apt.name}</td>
                      <td className="py-6 px-8 text-slate-600">{apt.type}</td>
                      <td className="py-6 px-8">
                        <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold border ${apt.statusColor}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button 
                          onClick={() => showToast(`Check-in token printed for ${apt.name}`)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
                        >
                          Check In
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Nurse':
        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Ward A Inpatient Bed Census</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Real-time bed occupancy & patient monitoring</p>
              </div>
              {isAuthorizedTab('Inpatient / Wards') && (
                <button 
                  onClick={() => setActiveTab('Inpatient / Wards')}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer px-4 py-2 bg-blue-50 rounded-xl"
                >
                  Ward Stations
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Bed No.</th>
                    <th className="py-6 px-8">Patient Name</th>
                    <th className="py-6 px-8">Diagnosis</th>
                    <th className="py-6 px-8">Status</th>
                    <th className="py-6 px-8 text-right">Nursing Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {initialData.wards[0]?.beds.slice(0, 5).map((bed) => (
                    <tr key={bed.bedId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-6 px-8 font-mono font-bold text-slate-900">{bed.bedId}</td>
                      <td className="py-6 px-8 font-bold text-slate-900">{bed.patientName || 'Unoccupied Bed'}</td>
                      <td className="py-6 px-8 text-slate-600">{bed.diagnosis || 'None'}</td>
                      <td className="py-6 px-8">
                        <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold border ${
                          bed.status === 'Occupied' 
                            ? 'bg-rose-50 text-rose-700 border-rose-200' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {bed.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        {bed.status === 'Occupied' ? (
                          hasPermission('record_vitals') ? (
                            <button 
                              onClick={() => {
                                setActiveTab('Inpatient / Wards');
                                showToast(`Opening vitals sheet for ${bed.patientName}`);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                            >
                              Log Vitals
                            </button>
                          ) : (
                            <span className="text-slate-500 text-xs font-medium">Under Observation</span>
                          )
                        ) : (
                          <span className="text-slate-400 text-xs font-medium">Ready for Admit</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Laboratory Technician':
        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Diagnostic Test Requests (Bench Queue)</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Specimens awaiting accessioning & analyzer run</p>
              </div>
              <button 
                onClick={() => setActiveTab('Laboratory')}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer px-4 py-2 bg-blue-50 rounded-xl"
              >
                Lab Workbench
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Test / Sample ID</th>
                    <th className="py-6 px-8">Patient Name</th>
                    <th className="py-6 px-8">Requested By</th>
                    <th className="py-6 px-8">Status</th>
                    <th className="py-6 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {initialData.labReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-6 px-8">
                        <span className="font-bold text-slate-900 block">{report.test}</span>
                        <span className="font-mono text-xs text-slate-400">{report.id}</span>
                      </td>
                      <td className="py-6 px-8 font-bold text-slate-900">{report.patientName}</td>
                      <td className="py-6 px-8 text-slate-600">{report.requestedBy}</td>
                      <td className="py-6 px-8">
                        <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold border ${
                          report.status === 'Completed' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button 
                          onClick={() => setActiveTab('Laboratory')}
                          className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                        >
                          {report.status === 'Completed' ? 'View PDF' : 'Enter Result'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Pharmacist':
        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Prescription Dispensation Counter</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Clinical e-prescriptions awaiting drug fulfillment</p>
              </div>
              <button 
                onClick={() => setActiveTab('Pharmacy')}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer px-4 py-2 bg-blue-50 rounded-xl"
              >
                Pharmacy Ledger
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Rx ID</th>
                    <th className="py-6 px-8">Patient Name</th>
                    <th className="py-6 px-8">Prescribed By</th>
                    <th className="py-6 px-8">Items</th>
                    <th className="py-6 px-8">Status</th>
                    <th className="py-6 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {initialData.prescriptions.map((rx) => (
                    <tr key={rx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-6 px-8 font-mono font-bold text-blue-700">{rx.id}</td>
                      <td className="py-6 px-8 font-bold text-slate-900">{rx.patientName}</td>
                      <td className="py-6 px-8 text-slate-600">{rx.doctor}</td>
                      <td className="py-6 px-8 text-slate-600 font-medium">{rx.items.length} medicines</td>
                      <td className="py-6 px-8">
                        <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold border ${
                          rx.status === 'Dispensed' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {rx.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button 
                          onClick={() => {
                            setActiveTab('Pharmacy');
                            showToast(`Reviewing dispensation for ${rx.id}`);
                          }}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
                        >
                          {rx.status === 'Dispensed' ? 'Re-print Slip' : 'Dispense'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Administrator':
        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Hospital Departmental Utilization</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Live capacity, staffing and patient flow across departments</p>
              </div>
              {isAuthorizedTab('Reports') && (
                <button 
                  onClick={() => setActiveTab('Reports')}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer px-4 py-2 bg-blue-50 rounded-xl"
                >
                  Full Analytics
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Department</th>
                    <th className="py-6 px-8">Active Staff</th>
                    <th className="py-6 px-8">Daily Volume</th>
                    <th className="py-6 px-8">Operational State</th>
                    <th className="py-6 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {[
                    { dept: 'General Medicine (OPD)', staff: '6 Doctors, 4 Nurses', volume: '128 Patients', status: 'Optimal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    { dept: 'Inpatient Wards (General & ICU)', staff: '12 Nurses on Duty', volume: '82% Occupancy', status: 'High Load', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                    { dept: 'Diagnostic Pathology Lab', staff: '4 Lab Technicians', volume: '42 Reports Finalized', status: 'Optimal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    { dept: 'Central Pharmacy & Dispensary', staff: '3 Pharmacists', volume: '74 Rx Dispensed', status: 'Low Stock Alert', color: 'bg-rose-50 text-rose-700 border-rose-200' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-6 px-8 font-bold text-slate-900">{row.dept}</td>
                      <td className="py-6 px-8 text-slate-600">{row.staff}</td>
                      <td className="py-6 px-8 font-semibold text-slate-800">{row.volume}</td>
                      <td className="py-6 px-8">
                        <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold border ${row.color}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button 
                          onClick={() => {
                            if (row.dept.includes('Inpatient') && isAuthorizedTab('Inpatient / Wards')) {
                              setActiveTab('Inpatient / Wards');
                              showToast('Navigated to Inpatient / Wards audit overview');
                            } else if (row.dept.includes('Pharmacy') && isAuthorizedTab('Pharmacy')) {
                              setActiveTab('Pharmacy');
                              showToast('Navigated to Central Pharmacy inventory & dispensation audit');
                            } else if (row.dept.includes('Pathology') && isAuthorizedTab('Laboratory')) {
                              setActiveTab('Laboratory');
                              showToast('Navigated to Diagnostic Pathology Lab audit');
                            } else if (row.dept.includes('General Medicine') && isAuthorizedTab('OPD & Consultation')) {
                              setActiveTab('OPD & Consultation');
                              showToast('Navigated to General Medicine (OPD) consultation audit');
                            } else {
                              showToast(`Opening audit logs for ${row.dept}`);
                            }
                          }}
                          className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                        >
                          Audit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Patient':
        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">My Appointments & Clinic Visits</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Your scheduled visits with hospital specialists</p>
              </div>
              <button 
                onClick={() => setActiveTab('Appointments')}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer px-4 py-2 bg-blue-50 rounded-xl"
              >
                Book Appointment
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Date & Time</th>
                    <th className="py-6 px-8">Consulting Doctor</th>
                    <th className="py-6 px-8">Department</th>
                    <th className="py-6 px-8">Status</th>
                    <th className="py-6 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {[
                    { date: 'Tomorrow • 10:30 AM', doc: 'Dr. Amit Sharma', dept: 'General Medicine', status: 'Confirmed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    { date: '15 May 2026 • 09:30 AM', doc: 'Dr. Amit Sharma', dept: 'Follow-up Clinic', status: 'Completed', color: 'bg-slate-100 text-slate-700 border-slate-200' },
                    { date: '12 Apr 2026 • 11:00 AM', doc: 'Dr. Rahul Kumar', dept: 'Cardiology Triage', status: 'Completed', color: 'bg-slate-100 text-slate-700 border-slate-200' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-6 px-8 font-semibold text-slate-900">{row.date}</td>
                      <td className="py-6 px-8 font-bold text-slate-900">{row.doc}</td>
                      <td className="py-6 px-8 text-slate-600">{row.dept}</td>
                      <td className="py-6 px-8">
                        <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold border ${row.color}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button 
                          onClick={() => showToast(`Appointment confirmed with ${row.doc}`)}
                          className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                        >
                          View Pass
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 4. Role-specific Right Panel Content
  const renderRightPanel = () => {
    switch (currentRole) {
      case 'Doctor':
        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Urgent Diagnostic Reviews</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Pathology tests requiring doctor clinical sign-off</p>
              </div>
              <button 
                onClick={() => setActiveTab('Laboratory')}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer px-4 py-2 bg-blue-50 rounded-xl"
              >
                Diagnostic Lab
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Patient Name</th>
                    <th className="py-6 px-8">Test Type</th>
                    <th className="py-6 px-8">Date</th>
                    <th className="py-6 px-8">Status</th>
                    <th className="py-6 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {initialData.recentLabReportsList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-6 px-8 font-bold text-slate-900">{item.patient}</td>
                      <td className="py-6 px-8 font-medium text-slate-700">{item.test}</td>
                      <td className="py-6 px-8 text-slate-500 tabular-nums">{item.date}</td>
                      <td className="py-6 px-8">
                        <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold border ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button 
                          onClick={() => {
                            setActiveTab('Laboratory');
                            showToast(`Opening clinical report for ${item.patient}`);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Receptionist':
        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">OPD Lobby Token Queue</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Live patient flow across consultation rooms</p>
              </div>
              {isAuthorizedTab('Appointments') && (
                <button 
                  onClick={() => setActiveTab('Appointments')}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer px-4 py-2 bg-blue-50 rounded-xl"
                >
                  Queue Desk
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Token</th>
                    <th className="py-6 px-8">Patient</th>
                    <th className="py-6 px-8">Time</th>
                    <th className="py-6 px-8">Counter Status</th>
                    <th className="py-6 px-8 text-right">Desk Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {initialData.queue.map((q) => (
                    <tr key={q.token} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-6 px-8 font-mono font-bold text-blue-700">{q.token}</td>
                      <td className="py-6 px-8 font-bold text-slate-900">{q.patient}</td>
                      <td className="py-6 px-8 text-slate-500 tabular-nums">{q.time}</td>
                      <td className="py-6 px-8">
                        <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold border ${
                          q.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          q.status === 'In consultation' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button 
                          onClick={() => showToast(`Called token ${q.token} on lobby speaker`)}
                          className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                        >
                          Announce
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Nurse':
        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Scheduled Vitals Rounds & Care</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Physiological monitoring roster for admitted patients</p>
              </div>
              {isAuthorizedTab('Inpatient / Wards') && (
                <button 
                  onClick={() => setActiveTab('Inpatient / Wards')}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer px-4 py-2 bg-blue-50 rounded-xl"
                >
                  Vitals Log
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Bed / Patient</th>
                    <th className="py-6 px-8">Scheduled Task</th>
                    <th className="py-6 px-8">Due Time</th>
                    <th className="py-6 px-8">Priority</th>
                    <th className="py-6 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {[
                    { bed: 'Bed A-101', patient: 'Ramesh Patel', task: 'BP & Pulse Check', due: '10:00 AM', priority: 'High', color: 'bg-rose-50 text-rose-700 border-rose-200' },
                    { bed: 'Bed A-102', patient: 'Anita Sharma', task: 'IV Antibiotic Flush', due: '10:15 AM', priority: 'Urgent', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                    { bed: 'Bed A-106', patient: 'Neha Das', task: 'Temperature Retest', due: '10:30 AM', priority: 'High', color: 'bg-rose-50 text-rose-700 border-rose-200' },
                    { bed: 'Bed G-12', patient: 'Astha Sharma', task: 'Post-op Observation', due: '11:00 AM', priority: 'Routine', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
                  ].map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-6 px-8">
                        <span className="font-mono font-bold text-slate-900 block">{item.bed}</span>
                        <span className="text-xs text-slate-500">{item.patient}</span>
                      </td>
                      <td className="py-6 px-8 font-semibold text-slate-800">{item.task}</td>
                      <td className="py-6 px-8 text-slate-500 tabular-nums">{item.due}</td>
                      <td className="py-6 px-8">
                        <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold border ${item.color}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        {hasPermission('record_vitals') ? (
                          <button 
                            onClick={() => {
                              setActiveTab('Inpatient / Wards');
                              showToast(`Opening vitals entry for ${item.bed}`);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                          >
                            Complete
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs font-medium">Scheduled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Laboratory Technician':
        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Analyzed Diagnostic Results</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Automated hematology & pathology parameters</p>
              </div>
              <button 
                onClick={() => setActiveTab('Laboratory')}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer px-4 py-2 bg-blue-50 rounded-xl"
              >
                CBC Analyzer
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Test Name</th>
                    <th className="py-6 px-8">Result</th>
                    <th className="py-6 px-8">Reference Range</th>
                    <th className="py-6 px-8">Flag</th>
                    <th className="py-6 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {initialData.cbcReportData.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-6 px-8 font-bold text-slate-900">{row.test}</td>
                      <td className="py-6 px-8 font-bold text-slate-900 tabular-nums">{row.result}</td>
                      <td className="py-6 px-8 text-slate-500 tabular-nums">{row.reference}</td>
                      <td className="py-6 px-8">
                        <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button 
                          onClick={() => {
                            setActiveTab('Laboratory');
                            showToast(`Viewing reference curve for ${row.test}`);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                        >
                          Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Pharmacist':
        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Low Stock & Reorder Watchlist</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Formulary supplies requiring restock indent</p>
              </div>
              <button 
                onClick={() => setActiveTab('Pharmacy')}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer px-4 py-2 bg-blue-50 rounded-xl"
              >
                Inventory
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Medicine Name</th>
                    <th className="py-6 px-8">Batch No.</th>
                    <th className="py-6 px-8">Current Units</th>
                    <th className="py-6 px-8">Stock State</th>
                    <th className="py-6 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {initialData.pharmacyMedicineCatalog.map((med, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-6 px-8">
                        <span className="font-bold text-slate-900 block">{med.name}</span>
                        <span className="text-xs text-slate-400">{med.category}</span>
                      </td>
                      <td className="py-6 px-8 font-mono text-xs text-slate-500">{med.batch}</td>
                      <td className="py-6 px-8 font-bold text-slate-900 tabular-nums">{med.stock} units</td>
                      <td className="py-6 px-8">
                        <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold border ${
                          med.status === 'In Stock' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {med.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button 
                          onClick={() => showToast(`Indent order placed for ${med.name}`)}
                          className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                        >
                          Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Administrator':
        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Security & RBAC Compliance Stream</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Immutable system audit trail of clinical & administrative events</p>
              </div>
              {isAuthorizedTab('Settings') && (
                <button 
                  onClick={() => setActiveTab('Settings')}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer px-4 py-2 bg-blue-50 rounded-xl"
                >
                  Audit Trail
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Log ID</th>
                    <th className="py-6 px-8">User & Role</th>
                    <th className="py-6 px-8">Action Event</th>
                    <th className="py-6 px-8">Timestamp</th>
                    <th className="py-6 px-8 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {initialData.auditLogs.map((log) => (
                    <tr key={log.logId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-6 px-8 font-mono text-xs text-slate-400 tabular-nums">#{log.logId}</td>
                      <td className="py-6 px-8">
                        <span className="font-bold text-slate-900 block text-xs">{log.user}</span>
                        <span className="text-[11px] text-slate-400">{log.role}</span>
                      </td>
                      <td className="py-6 px-8 font-mono text-xs font-semibold text-slate-800">{log.action}</td>
                      <td className="py-6 px-8 text-xs text-slate-500 tabular-nums">{log.timestamp}</td>
                      <td className="py-6 px-8 text-right">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Patient':
        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">My Active Prescriptions & Medications</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Current dosage instructions prescribed by your doctor</p>
              </div>
              <button 
                onClick={() => showToast('Prescription refill request dispatched to central dispensary', 'success')}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer px-4 py-2 bg-blue-50 rounded-xl"
              >
                Request Refill
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Medicine Name</th>
                    <th className="py-6 px-8">Dosage & Frequency</th>
                    <th className="py-6 px-8">Duration</th>
                    <th className="py-6 px-8">Instructions</th>
                    <th className="py-6 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {[
                    { name: 'Paracetamol 650mg', dose: '1 Tablet • Twice daily', duration: '5 days (3 remaining)', instr: 'Take after meals with warm water' },
                    { name: 'Cetirizine 10mg', dose: '1 Tablet • Once daily', duration: '5 days (3 remaining)', instr: 'Take at bedtime' },
                    { name: 'Pantoprazole 40mg', dose: '1 Tablet • Morning', duration: '5 days (3 remaining)', instr: 'Take 30 mins before breakfast' }
                  ].map((med, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-6 px-8 font-bold text-slate-900">{med.name}</td>
                      <td className="py-6 px-8 font-semibold text-blue-700">{med.dose}</td>
                      <td className="py-6 px-8 text-slate-600">{med.duration}</td>
                      <td className="py-6 px-8 text-slate-500 text-xs">{med.instr}</td>
                      <td className="py-6 px-8 text-right">
                        <button 
                          onClick={() => showToast(`Reminder set for ${med.name}`)}
                          className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                        >
                          Set Reminder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 5. Role-specific Alerts
  const getRoleAlerts = () => {
    switch (currentRole) {
      case 'Doctor':
        return [
          { text: '2 critical laboratory reports awaiting doctor clinical sign-off', type: 'rose' },
          { text: 'Patient Astha Sharma queued in consultation room 3', type: 'amber' }
        ];
      case 'Receptionist':
        return [
          { text: 'Lobby seating capacity at 75% • General Medicine queue active', type: 'amber' },
          { text: '12 hospital beds available for walk-in emergency admissions', type: 'emerald' }
        ];
      case 'Nurse':
        return [
          { text: 'Bed A-106 (Neha Das): High temperature recorded (102.4°F)', type: 'rose' },
          { text: 'Scheduled medication round due in 15 mins for Ward A', type: 'amber' }
        ];
      case 'Laboratory Technician':
        return [
          { text: 'Critical Hemoglobin (< 7.0 g/dL) detected for sample LAB2026111005', type: 'rose' },
          { text: 'Hematology Analyzer maintenance calibration due at 2:00 PM', type: 'amber' }
        ];
      case 'Pharmacist':
        return [
          { text: '5 medicines in low stock (Amoxicillin 500mg, Azithromycin 500mg)', type: 'rose' },
          { text: 'Batch AMX2026B expires in August 2026 — priority rotation needed', type: 'amber' }
        ];
      case 'Administrator':
        return [
          { text: 'General Ward A bed occupancy reached 85% capacity threshold', type: 'amber' },
          { text: 'Full database encrypted backup successfully verified at 03:00 AM', type: 'emerald' }
        ];
      case 'Patient':
        return [
          { text: 'Your Complete Blood Count (CBC) report from 09 Nov is ready for download', type: 'emerald' },
          { text: 'Upcoming consultation tomorrow at 10:30 AM with Dr. Amit Sharma', type: 'blue' }
        ];
      default:
        return [];
    }
  };

  const metrics = getRoleMetrics();
  const quickActions = getRoleQuickActions();
  const roleAlerts = getRoleAlerts();

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 animate-fade-in text-slate-800">
      
      {/* 1. Dynamic Header Greeting & Current Actor Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${actorMeta.badgeColor}`}>
              {actorMeta.roleBadge}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 flex items-center gap-4 leading-snug">
            <span>{actorMeta.greeting}</span>
            <span className="text-4xl">👋</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 mt-3 leading-relaxed max-w-2xl">
            {actorMeta.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 shrink-0">
          <div className="flex items-center gap-2 p-2.5 bg-slate-100/90 rounded-2xl border border-slate-200">
            {['Today', 'Week', 'Month'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeframe(tab)}
                className={`px-6 py-3 rounded-xl transition-all cursor-pointer text-sm font-semibold ${
                  timeframe === tab
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4 text-sm text-slate-600 font-medium bg-white px-6 py-4 rounded-2xl border border-slate-200/90 shadow-sm">
            <Calendar className="w-6 h-6 text-blue-600 shrink-0" />
            <div className="text-right leading-relaxed">
              <span className="font-bold text-slate-800 block text-base">Monday, 10 Nov 2026</span>
              <span className="text-sm text-slate-400">10:24 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Actor-Tailored 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((m, idx) => {
          const IconComponent = m.icon;
          return (
            <div 
              key={idx} 
              className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow"
            >
              <div className={`w-16 h-16 rounded-2xl ${m.iconBg} ${m.iconColor} flex items-center justify-center shrink-0`}>
                <IconComponent className="w-8 h-8" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {m.title}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums leading-tight">
                  {m.value}
                </div>
                <div className={`text-xs sm:text-sm font-medium ${m.subColor} flex items-center gap-1.5 mt-2.5`}>
                  <span>{m.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Quick Action Shortcuts for Current Actor */}
      {quickActions.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
            Workspace Shortcuts:
          </span>
          {quickActions.map((action, idx) => {
            const ActionIcon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveTab(action.tab);
                  showToast(`Switched to ${action.tab} for ${action.label}`);
                }}
                className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-400 hover:text-blue-700 text-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <ActionIcon className="w-4 h-4 text-blue-600" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Two-Column Role-Specific Data Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
        {renderLeftPanel()}
        {renderRightPanel()}
      </div>

      {/* 5. Actor-Specific Alert Strip */}
      {roleAlerts.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 mt-4">
          <div className="flex flex-wrap items-center gap-8 sm:gap-10">
            <div className="flex items-center gap-4 font-bold text-slate-900 shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold block">{actorMeta.roleBadge} Alerts</span>
                <span className="text-xs text-slate-400">Strictly filtered for your authorization scope</span>
              </div>
            </div>

            {roleAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-center gap-3 text-slate-700 font-semibold text-xs sm:text-sm">
                <span className={`w-3 h-3 rounded-full shrink-0 ${
                  alert.type === 'rose' ? 'bg-rose-500' :
                  alert.type === 'amber' ? 'bg-amber-500' :
                  alert.type === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
                }`}></span>
                <span>{alert.text}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => showToast(`All priority notifications reviewed for ${currentRole}`)}
            className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2 cursor-pointer shrink-0 bg-blue-50 px-6 py-3 rounded-xl transition-colors"
          >
            <span>Review Alerts</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
