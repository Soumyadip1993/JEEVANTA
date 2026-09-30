import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Calendar, 
  Clock, 
  Pill, 
  FlaskConical, 
  Download, 
  CheckCircle2, 
  ChevronRight,
  Printer
} from 'lucide-react';

export const PatientPortal = () => {
  const { 
    activeTab, 
    setActiveTab, 
    primaryPatient, 
    clinicalTimeline, 
    prescriptions, 
    labReports,
    showToast 
  } = useHospital();

  const [selectedSlot, setSelectedSlot] = useState('10:30');
  const [selectedCalDay, setSelectedCalDay] = useState(15);
  const [selectedLabReport, setSelectedLabReport] = useState(labReports[0]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const availableSlots = ['09:30', '10:00', '10:30', '11:00', '11:30'];

  // 1. Dashboard View
  if (activeTab === 'Dashboard') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Good morning, {primaryPatient.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your hospital activity at a glance • PID: <span className="font-mono font-semibold text-slate-700">{primaryPatient.id}</span>
          </p>
        </div>

        {/* 3 Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={() => setActiveTab('Appointments')}
            className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Upcoming Appointments</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tabular-nums">2</span>
              <span className="text-[11px] text-[#065F46] font-medium bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                Next: 15 Sep
              </span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('Prescriptions')}
            className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Active Prescriptions</span>
              <Pill className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tabular-nums">1</span>
              <span className="text-[11px] text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                3 Formulations
              </span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('Lab Reports')}
            className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Diagnostic Reports</span>
              <FlaskConical className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tabular-nums">
                {labReports.filter(r => r.status === 'Completed').length}
              </span>
              <span className="text-[11px] text-[#065F46] font-medium bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Next Visit & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Your Next Scheduled Visit</h2>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/70">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                  {primaryPatient.upcomingAppointment.department}
                </span>
                <span className="text-[11px] font-medium text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                  {primaryPatient.upcomingAppointment.status}
                </span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-2.5">
                {primaryPatient.upcomingAppointment.doctor}
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{primaryPatient.upcomingAppointment.date}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{primaryPatient.upcomingAppointment.time}</span>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => setActiveTab('Appointments')}
                  className="h-8 px-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Manage Appointment
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Quick Navigation</h2>
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('Appointments')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200/70 hover:border-blue-300 hover:bg-slate-50 transition-colors text-left text-xs font-medium text-slate-800 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold text-slate-900">Schedule OPD Visit</div>
                    <div className="text-[11px] text-slate-400">Choose department & physician</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button 
                onClick={() => setActiveTab('Prescriptions')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200/70 hover:border-blue-300 hover:bg-slate-50 transition-colors text-left text-xs font-medium text-slate-800 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Pill className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold text-slate-900">View Prescriptions</div>
                    <div className="text-[11px] text-slate-400">Medications, doses and instructions</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button 
                onClick={() => setActiveTab('Lab Reports')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200/70 hover:border-blue-300 hover:bg-slate-50 transition-colors text-left text-xs font-medium text-slate-800 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FlaskConical className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold text-slate-900">Download Diagnostic Results</div>
                    <div className="text-[11px] text-slate-400">Pathology blood work & reports</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Book Appointment & Calendar
  if (activeTab === 'Appointments') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Find an Appointment
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Select hospital department, doctor and a convenient time slot
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Book a New Appointment
            </h2>

            {bookingSuccess && (
              <div className="mb-4 p-3.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center gap-2.5 text-[#065F46] text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong>Appointment Confirmed!</strong> Your token has been generated. Please arrive 15 mins prior.
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Hospital Department</label>
                <select className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option>General Medicine (OPD)</option>
                  <option>Cardiology</option>
                  <option>Orthopedics</option>
                  <option>Pediatrics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Consulting Physician</label>
                <select className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option>Dr. Amit Sharma (MD - General Medicine)</option>
                  <option>Dr. Rahul Kumar (DM - Cardiology)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Appointment Date</label>
                  <input 
                    type="date" 
                    defaultValue="2026-09-15" 
                    className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Selected Slot</label>
                  <input 
                    type="text" 
                    value={`${selectedSlot} AM`} 
                    readOnly 
                    className="w-full px-3.5 h-10 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-700 font-semibold" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Available Slots (OPD Session)</label>
                <div className="flex flex-wrap gap-2">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setBookingSuccess(true);
                    showToast('Appointment successfully scheduled for 15 Sep at ' + selectedSlot + ' AM');
                  }}
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Confirm Appointment & Generate Token
                </button>
              </div>
            </div>
          </div>

          {/* Before You Visit Checklist & Calendar */}
          <div className="space-y-4">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Before You Visit
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Reach the OPD counter 15 minutes early.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Carry your digital Patient ID: <strong>{primaryPatient.id}</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Bring previous prescriptions and reports.</span>
                </li>
              </ul>
            </div>

            {/* Calendar Validation View */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-xs text-slate-900">September 2026</h4>
                <span className="text-[11px] text-slate-400">30 Days</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-1">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                <div className="p-1 opacity-0">0</div>
                {[...Array(30)].map((_, i) => {
                  const day = i + 1;
                  const isSelected = day === selectedCalDay;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedCalDay(day)}
                      className={`p-1.5 rounded font-medium transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-600 text-white font-bold' 
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 p-2 bg-blue-50/60 rounded border border-blue-100 text-[11px] text-slate-600">
                Selected: <strong>{selectedCalDay} September 2026</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Medical History / Longitudinal EMR
  if (activeTab === 'Medical History') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Medical History / EMR
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central longitudinal electronic medical record for {primaryPatient.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Demographic Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col items-center pb-4 border-b border-slate-100 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-xs mb-2">
                {primaryPatient.name.charAt(0)}
              </div>
              <h2 className="text-base font-bold text-slate-900">{primaryPatient.name}</h2>
              <span className="font-mono text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 mt-1">
                {primaryPatient.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Age</span>
                <span className="font-bold text-slate-800">{primaryPatient.age}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Gender</span>
                <span className="font-bold text-slate-800">{primaryPatient.gender}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Blood Group</span>
                <span className="font-bold text-rose-600">{primaryPatient.bloodGroup}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Allergies</span>
                <span className="font-semibold text-slate-700">{primaryPatient.allergies}</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 space-y-1">
              <div><strong>Contact:</strong> {primaryPatient.phone}</div>
              <div><strong>Address:</strong> {primaryPatient.address}</div>
            </div>
          </div>

          {/* Clinical Timeline */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Clinical Consultations Timeline
            </h2>

            <div className="space-y-4 relative pl-5 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
              {clinicalTimeline.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-blue-600"></div>
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-semibold text-slate-900">{item.date}</span>
                      <span className="font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                        {item.type}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">
                      {item.title}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {item.notes}
                    </p>
                    <div className="mt-1.5 text-[11px] text-blue-600 font-medium">
                      Physician: {item.doctor}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Digital Prescriptions
  if (activeTab === 'Prescriptions') {
    const rx = prescriptions[0];
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Digital Prescriptions
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Legible digital prescriptions issued by hospital doctors
            </p>
          </div>
          <button 
            onClick={() => window.print()}
            className="h-9 px-3.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download / Print</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs max-w-3xl">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prescription Header</span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">{rx.doctor}</h2>
              <p className="text-xs text-slate-500">{rx.department} • Date Issued: {rx.date}</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {rx.id}
              </span>
              <div className="mt-1">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                  {rx.status}
                </span>
              </div>
            </div>
          </div>

          <table className="w-full text-left border-collapse text-xs mb-4">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/70 font-semibold">
                <th className="py-2.5 px-3">Medicine</th>
                <th className="py-2.5 px-3">Dose</th>
                <th className="py-2.5 px-3">Frequency</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rx.items.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{item.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{item.dose}</td>
                  <td className="py-2.5 px-3 text-slate-600">{item.frequency}</td>
                  <td className="py-2.5 px-3 text-slate-600">{item.duration}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 mb-4">
            <strong className="text-slate-800 block mb-0.5">Instructions:</strong>
            {rx.instructions}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3">
            <div>Patient: {primaryPatient.name} ({primaryPatient.id})</div>
            <div>Digitally verified by Central Government Hospital Registry</div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Diagnostic Lab Reports
  if (activeTab === 'Lab Reports') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Diagnostic Lab Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official test results linked securely to your medical record
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports Navigation List */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Available Reports</h3>
            {labReports.map((report) => {
              const isSelected = selectedLabReport?.id === report.id;
              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedLabReport(report)}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    isSelected 
                      ? 'border-blue-300 bg-blue-50/60 shadow-2xs' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-slate-900 text-xs">{report.test}</strong>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      report.status === 'Completed' 
                        ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' 
                        : 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{report.requestDate}</span>
                    <span className="font-mono">{report.id}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Report Detail View */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            {selectedLabReport ? (
              <div>
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{selectedLabReport.test}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Requested by {selectedLabReport.requestedBy} • {selectedLabReport.requestDate}
                    </p>
                  </div>
                  <button 
                    onClick={() => showToast(`Downloaded ${selectedLabReport.test} Report PDF`)}
                    className="h-8 px-3 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report</span>
                  </button>
                </div>

                {selectedLabReport.status === 'Completed' && selectedLabReport.metrics.length > 0 ? (
                  <>
                    <table className="w-full text-left text-xs border-collapse mb-4">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/70 font-semibold">
                          <th className="py-2.5 px-3">Test Parameter</th>
                          <th className="py-2.5 px-3">Observed Value</th>
                          <th className="py-2.5 px-3">Unit</th>
                          <th className="py-2.5 px-3">Biological Reference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedLabReport.metrics.map((m, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-medium text-slate-800">{m.test}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">{m.result}</td>
                            <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{m.unit}</td>
                            <td className="py-2.5 px-3 text-slate-500">{m.normal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg text-xs text-[#065F46] font-medium">
                      ✓ {selectedLabReport.remarks}
                    </div>
                  </>
                ) : (
                  <div className="py-10 text-center text-slate-400">
                    <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-500" />
                    <div className="font-semibold text-slate-700 text-xs">Specimen Processing In Progress</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Results will be automatically uploaded here once finalized by the laboratory.
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
