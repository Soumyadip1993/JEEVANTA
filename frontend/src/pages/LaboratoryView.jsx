import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { initialData } from '../data/mockDatabase';
import { 
  Download, 
  Printer, 
  ChevronRight,
  FlaskConical
} from 'lucide-react';

export const LaboratoryView = () => {
  const { showToast, currentRole, hasPermission } = useHospital();
  const [activeTab, setActiveTab] = useState('Report'); // 'Report', 'Trends', 'Notes'
  const [viewMode, setViewMode] = useState('details'); // 'details' or 'queue'
  const [isApproved, setIsApproved] = useState(false);

  const cbc = initialData.cbcReportData;
  const allReports = initialData.recentLabReportsList;
  const recentReports = currentRole === 'Patient'
    ? allReports.filter(r => r.patient === 'Ramesh Kumar')
    : allReports;

  return (
    <div className="space-y-10 sm:space-y-12 pb-20 animate-fade-in max-w-6xl mx-auto text-slate-800">
      {/* Header with Generous Clearances */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-200/70">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 flex items-center gap-3.5 leading-snug">
            <FlaskConical className="w-8 h-8 text-blue-600 shrink-0" />
            <span>{viewMode === 'details' ? 'Laboratory Report Details' : 'Laboratory Diagnostic Queue'}</span>
          </h1>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-500 mt-2">
            <span>Laboratory</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span>Reports</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-slate-800 font-medium">Diagnostic Record</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {currentRole !== 'Patient' && (
            <button
              onClick={() => setViewMode(viewMode === 'details' ? 'queue' : 'details')}
              className="px-5 py-3 text-sm font-semibold rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {viewMode === 'details' ? 'View All Tests Queue' : 'View Sample CBC'}
            </button>
          )}

          {hasPermission('upload_lab_report') && (
            <button
              onClick={() => showToast('Uploaded verified diagnostic report file to hospital PACS', 'success')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-2xl shadow-xs transition-colors cursor-pointer"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Upload Report</span>
            </button>
          )}

          {hasPermission('review_lab_results') && (
            <button
              onClick={() => {
                setIsApproved(true);
                showToast('Diagnostic CBC report clinically reviewed and signed off by Doctor', 'success');
              }}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-xs transition-colors cursor-pointer"
            >
              <span>{isApproved ? '✓ Sign-Off Complete' : 'Approve & Sign Off'}</span>
            </button>
          )}

          {(hasPermission('download_own_lab_reports') || hasPermission('view_lab_reports') || hasPermission('upload_lab_report')) && (
            <button
              onClick={() => showToast('Downloading CBC Lab Report PDF...', 'success')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-2xl hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          )}

          <button
            onClick={() => showToast(`Print command sent for Diagnostic Report: ${cbc.sampleId || 'LAB2026111005'}`)}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {viewMode === 'details' ? (
        <div className="space-y-8 sm:space-y-10">
          {/* Patient & Sample Specimen Info Card with Generous Padding */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg border-2 border-blue-100 shadow-2xs shrink-0 select-none">
                {cbc.patientName.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{cbc.patientName}</h2>
                  <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-mono font-medium border border-blue-200">
                    {cbc.patientId}
                  </span>
                </div>
                <div className="text-sm text-slate-500 mt-1.5">{cbc.ageGender}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-10 text-sm border-t md:border-t-0 md:border-l border-slate-100 pt-5 md:pt-0 md:pl-10">
              <div>
                <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">Sample ID</span>
                <span className="font-mono font-bold text-slate-900 text-base">{cbc.sampleId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">Collection Date</span>
                <span className="font-semibold text-slate-900 text-base">{cbc.collectionDate}</span>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs with Generous Spacing */}
          <div className="border-b border-slate-200 flex items-center gap-8 sm:gap-10 text-sm font-semibold overflow-x-auto pb-0.5">
            {['Report', 'Trends', 'Notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab !== 'Report') {
                    showToast({ type: 'info', message: `The ${tab} analysis module is currently under development.` });
                  }
                }}
                className={`py-4 transition-colors border-b-2 cursor-pointer text-sm ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'Report' ? 'Complete Blood Count (CBC)' : tab}
              </button>
            ))}
          </div>

          {/* CBC Results Table Card with Roomy Cells */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-7 sm:p-9 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Diagnostic Parameters</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Automated Analyzer Model Beckman Coulter DxH 900</p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified & Completed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[660px] text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-6 px-8">Test</th>
                    <th className="py-6 px-8">Result</th>
                    <th className="py-6 px-8">Reference Range</th>
                    <th className="py-6 px-8">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 leading-relaxed">
                  {cbc.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-6 px-8 font-semibold text-slate-900">{row.test}</td>
                      <td className="py-6 px-8 font-bold text-slate-900 tabular-nums">{row.result}</td>
                      <td className="py-6 px-8 text-slate-500 tabular-nums">{row.reference}</td>
                      <td className="py-6 px-8">
                        <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 sm:p-8 bg-slate-50/60 border-t border-slate-100 text-xs sm:text-sm text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span>Technician: Rahul Mehta (Lab Technologist)</span>
              <span>Approved by: Dr. Ananya Sharma (Pathologist)</span>
            </div>
          </div>
        </div>
      ) : (
        /* Test Requests Queue */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-7 sm:p-9 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Diagnostic Reports</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Showing last 5 completed diagnostic runs</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-6 px-8">Patient Name</th>
                  <th className="py-6 px-8">Test Type</th>
                  <th className="py-6 px-8">Date</th>
                  <th className="py-6 px-8">Status</th>
                  <th className="py-6 px-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 leading-relaxed">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-6 px-8 font-semibold text-slate-900">{report.patient}</td>
                    <td className="py-6 px-8 text-slate-600">{report.test}</td>
                    <td className="py-6 px-8 text-slate-500 tabular-nums">{report.date}</td>
                    <td className="py-6 px-8">
                      <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-medium border ${report.statusColor}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      {hasPermission('enter_lab_result') && report.status !== 'Completed' ? (
                        <button
                          onClick={() => {
                            setViewMode('details');
                            showToast(`Entering diagnostic parameters for ${report.patient}`);
                          }}
                          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                        >
                          Enter Result
                        </button>
                      ) : hasPermission('review_lab_results') ? (
                        <button
                          onClick={() => {
                            setViewMode('details');
                            showToast(`Reviewing diagnostic report for ${report.patient}`);
                          }}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          Review & Sign
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setViewMode('details');
                            showToast(`Opened lab report for ${report.patient}`);
                          }}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          {currentRole === 'Patient' ? 'View My Report' : 'View Report'}
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
