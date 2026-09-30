import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Download, 
  ChevronRight, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Users, 
  UserCheck,
  FileBarChart
} from 'lucide-react';

export const ReportsAnalyticsView = () => {
  const { showToast, hasPermission } = useHospital();
  const [activeTab, setActiveTab] = useState('OPD');
  const [dateRange] = useState('01 Nov 2026 - 10 Nov 2026');

  const departments = [
    { name: 'General Medicine', percent: 38, color: '#2563EB' },
    { name: 'Pediatrics', percent: 18, color: '#38BDF8' },
    { name: 'Gynecology', percent: 12, color: '#818CF8' },
    { name: 'Orthopedics', percent: 10, color: '#F59E0B' },
    { name: 'Others', percent: 22, color: '#94A3B8' }
  ];

  return (
    <div className="space-y-10 sm:space-y-12 pb-20 animate-fade-in max-w-6xl mx-auto text-slate-800">
      {/* Header with Generous Clearances */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-200/70">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 flex items-center gap-3.5 leading-snug">
            <FileBarChart className="w-8 h-8 text-blue-600 shrink-0" />
            <span>Hospital Telemetry, Reports & Analytics</span>
          </h1>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-500 mt-2">
            <span>Reports</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-slate-800 font-medium">{activeTab} Analytics</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3.5">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-700 shadow-2xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{dateRange}</span>
          </div>

          {hasPermission('export_reports') && (
            <button
              onClick={() => showToast('Exporting analytics CSV report...', 'success')}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-2xl shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs: OPD, IPD, Laboratory, Pharmacy, Staff, Financial */}
      <div className="border-b border-slate-200 flex items-center gap-8 sm:gap-10 text-sm font-semibold overflow-x-auto pb-0.5">
        {['OPD', 'IPD', 'Laboratory', 'Pharmacy', 'Staff', 'Financial'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'Staff' || tab === 'Financial') {
                showToast({ type: 'info', message: `The ${tab} telemetry analytics report is currently under development.` });
              }
            }}
            className={`py-4 transition-colors border-b-2 cursor-pointer text-sm whitespace-nowrap ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4 KPI Cards with Generous Inner Padding and Breathing Room */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total OPD Patients</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums mt-3">1,248</div>
          <div className="text-xs sm:text-sm font-medium text-emerald-600 mt-2.5 flex items-center gap-1.5 leading-relaxed">
            <TrendingUp className="w-4 h-4" />
            <span>+8% from previous period</span>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>New Registrations</span>
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums mt-3">412</div>
          <div className="text-xs sm:text-sm font-medium text-emerald-600 mt-2.5 leading-relaxed">
            +12% increase
          </div>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Average Waiting Time</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums mt-3">24 mins</div>
          <div className="text-xs sm:text-sm font-medium text-emerald-600 mt-2.5 leading-relaxed">
            -18% (Faster triage)
          </div>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Follow-up Visits</span>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums mt-3">346</div>
          <div className="text-xs sm:text-sm font-medium text-emerald-600 mt-2.5 leading-relaxed">
            +5% this month
          </div>
        </div>
      </div>

      {/* Visualizations Grid with Wide Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
        {/* Left Card: Patient Trend with Roomy Padding */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Patient Trend</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Daily OPD flow over current cycle</p>
            </div>
          </div>

          <div className="pt-2">
            <svg viewBox="0 0 400 180" className="w-full h-48 overflow-visible">
              {/* Grid lines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="140" x2="400" y2="140" stroke="#f1f5f9" strokeDasharray="3 3" />

              {/* Y Axis text */}
              <text x="5" y="24" className="text-[10px] fill-slate-400">200</text>
              <text x="5" y="64" className="text-[10px] fill-slate-400">150</text>
              <text x="5" y="104" className="text-[10px] fill-slate-400">100</text>
              <text x="5" y="144" className="text-[10px] fill-slate-400">50</text>

              {/* Area fill */}
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 40 120 Q 110 50, 180 90 T 320 40 T 390 80 L 390 150 L 40 150 Z"
                fill="url(#blueGradient)"
              />

              {/* Trend Line */}
              <path
                d="M 40 120 Q 110 50, 180 90 T 320 40 T 390 80"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="40" cy="120" r="4" fill="#2563EB" />
              <circle cx="120" cy="65" r="4" fill="#2563EB" />
              <circle cx="200" cy="85" r="4" fill="#2563EB" />
              <circle cx="280" cy="50" r="4" fill="#2563EB" />
              <circle cx="360" cy="65" r="4" fill="#2563EB" />
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-slate-400 pt-3 px-6">
              <span>01 Nov</span>
              <span>03 Nov</span>
              <span>05 Nov</span>
              <span>07 Nov</span>
              <span>09 Nov</span>
            </div>
          </div>
        </div>

        {/* Right Card: Department-wise Distribution */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Department-wise Distribution</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Total: 1,248 patients</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-2">
            {/* Donut Chart SVG */}
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#2563EB" strokeWidth="4" strokeDasharray="33.4 100" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#38BDF8" strokeWidth="4" strokeDasharray="15.8 100" strokeDashoffset="-33.4" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#818CF8" strokeWidth="4" strokeDasharray="10.5 100" strokeDashoffset="-49.2" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray="8.8 100" strokeDashoffset="-59.7" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#94A3B8" strokeWidth="4" strokeDasharray="19.3 100" strokeDashoffset="-68.5" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold text-slate-900 leading-none">1,248</span>
                <span className="text-xs text-slate-400 mt-1">Patients</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="space-y-3 text-xs sm:text-sm w-full">
              {departments.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></span>
                    <span className="text-slate-600 font-medium">{dept.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">{dept.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
