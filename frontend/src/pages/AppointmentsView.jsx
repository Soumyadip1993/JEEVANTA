import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { initialData } from '../data/mockDatabase';
import { 
  Calendar, 
  Clock, 
  ChevronRight
} from 'lucide-react';

export const AppointmentsView = () => {
  const { showToast, setActiveTab, currentRole, currentUser, hasPermission } = useHospital();
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [department, setDepartment] = useState('General Medicine');
  const [doctor, setDoctor] = useState('Dr. Ananya Sharma');
  const [selectedDate, setSelectedDate] = useState('2026-11-10');
  const [reason, setReason] = useState('Routine blood pressure checkup and mild chest tightness.');
  const [viewTab, setViewTab] = useState(hasPermission('book_appointment') ? 'book' : 'schedule');

  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM'
  ];

  // Strict Data Scoping: Patients only see their own appointments; Staff see assigned schedule
  const allAppointments = initialData.todayAppointments;
  const scopedAppointments = currentRole === 'Patient'
    ? allAppointments.filter(apt => apt.name === (currentUser?.name || 'Ramesh Kumar'))
    : allAppointments;

  const handleConfirm = (e) => {
    e.preventDefault();
    const patientName = currentRole === 'Patient' ? (currentUser?.name || 'Ramesh Kumar') : 'Ramesh Kumar';
    showToast(`Appointment confirmed for ${patientName} with ${doctor} at ${selectedSlot}!`, 'success');
  };

  return (
    <div className="space-y-10 sm:space-y-12 pb-20 animate-fade-in max-w-6xl mx-auto text-slate-800">
      {/* Header with Generous Clearances */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-200/70">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-snug">
            {viewTab === 'book' ? 'Search & Book Appointment' : 'Daily Appointment Schedule'}
          </h1>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-500 mt-2">
            <span>Appointments</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-slate-800 font-medium">
              {viewTab === 'book' ? 'New OPD Booking' : 'Daily Clinical Schedule'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasPermission('book_appointment') && (
            <button
              onClick={() => setViewTab('book')}
              className={`px-5 py-3 text-sm font-semibold rounded-2xl transition-all cursor-pointer ${
                viewTab === 'book'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Book New
            </button>
          )}
          <button
            onClick={() => setViewTab('schedule')}
            className={`px-5 py-3 text-sm font-semibold rounded-2xl transition-all cursor-pointer ${
              viewTab === 'schedule'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {currentRole === 'Patient' ? `My Bookings (${scopedAppointments.length})` : `Today's Schedule (${scopedAppointments.length})`}
          </button>
        </div>
      </div>

      {viewTab === 'book' ? (
        <div className="space-y-8 sm:space-y-10">
          {/* Filter Card: Department, Doctor, Date with Roomy Padding */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-12 px-4 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Gynecology">Gynecology</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                  Physician / Specialist
                </label>
                <select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="w-full h-12 px-4 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="Dr. Ananya Sharma">Dr. Ananya Sharma</option>
                  <option value="Dr. Rajesh Verma">Dr. Rajesh Verma</option>
                  <option value="Dr. Amit Shah">Dr. Amit Shah</option>
                  <option value="Dr. Priya Nair">Dr. Priya Nair</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                  Consultation Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-12 px-4 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Time Slot Buttons with Roomy Spacing */}
            <div className="pt-8 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
                Available Time Slots
              </label>
              <div className="flex flex-wrap items-center gap-3.5">
                {timeSlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Slot Summary Card */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs space-y-8 sm:space-y-10">
            <h2 className="text-xl font-bold text-slate-900">Selected Appointment Slot</h2>

            <div className="p-7 sm:p-8 rounded-3xl bg-slate-50/80 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0 select-none">
                  {doctor.replace('Dr. ', '').split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base sm:text-lg">{doctor}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{department}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">10 Nov 2026</span>
                    <span className="text-xs text-slate-500 mt-0.5">{selectedSlot} - 10:15 AM</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">15 mins</span>
                    <span className="text-xs text-slate-500 mt-0.5">Clinical Consultation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient & Reason Form */}
            <form onSubmit={handleConfirm} className="space-y-6">
              <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-400 uppercase text-xs font-bold">Patient:</span>
                  <span className="font-bold text-slate-900">
                    {currentRole === 'Patient' ? (currentUser?.name || 'Ramesh Kumar') : 'Ramesh Kumar (PID001)'}
                  </span>
                </div>
                {hasPermission('register_patient') && (
                  <button
                    type="button"
                    onClick={() => showToast('Select another patient')}
                    className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Change Patient
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Reason for Visit & Symptoms
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-4 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
                {hasPermission('book_appointment') ? (
                  <button
                    type="submit"
                    className="h-13 px-8 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl shadow-xs transition-colors cursor-pointer"
                  >
                    Confirm & Generate OPD Token
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-medium italic">Booking restricted to Reception and Patients</span>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Daily Schedule Table with Spacious Cell Padding */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-6 px-8">Time</th>
                  <th className="py-6 px-8">Patient Name</th>
                  <th className="py-6 px-8">Department</th>
                  <th className="py-6 px-8">Doctor</th>
                  <th className="py-6 px-8">Status</th>
                  <th className="py-6 px-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 leading-relaxed">
                {scopedAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-6 px-8 font-mono font-semibold text-slate-900">{apt.time}</td>
                    <td className="py-6 px-8 font-semibold text-slate-900">{apt.name}</td>
                    <td className="py-6 px-8 text-slate-600">{apt.type}</td>
                    <td className="py-6 px-8 text-slate-600">Dr. Ananya Sharma</td>
                    <td className="py-6 px-8">
                      <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-medium border ${apt.statusColor}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      {hasPermission('conduct_consultation') && (
                        <button 
                          onClick={() => {
                            setActiveTab('OPD & Consultation');
                            showToast(`Opened consultation workbench for ${apt.name}`);
                          }}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          Start Visit
                        </button>
                      )}
                      {hasPermission('checkin_patient') && (
                        <button 
                          onClick={() => {
                            showToast(`Checked in ${apt.name} for OPD token queue`);
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-2xs"
                        >
                          Check In
                        </button>
                      )}
                      {currentRole === 'Patient' && (
                        <button 
                          onClick={() => {
                            showToast(`Viewing digital clinic appointment pass for ${apt.time}`);
                          }}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          View Pass
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
