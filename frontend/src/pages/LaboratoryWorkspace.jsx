import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  CheckCircle2, 
  Clock, 
  UploadCloud, 
  FileUp 
} from 'lucide-react';

export const LaboratoryWorkspace = () => {
  const { 
    activeTab, 
    setActiveTab, 
    labReports, 
    uploadLabReport, 
    showToast 
  } = useHospital();

  const [selectedTest, setSelectedTest] = useState(labReports.find(l => l.status === 'Pending') || labReports[0]);
  const [resultValue, setResultValue] = useState('Hemoglobin: 13.2 g/dL, WBC: 7,200 cells/µL, Platelets: 230,000 /µL');
  const [remarks, setRemarks] = useState('All biological parameters within standard reference ranges.');
  const fileName = 'Finalized_Pathology_Report.pdf';
  const [fileAttached, setFileAttached] = useState(true);

  const pendingTests = labReports.filter(l => l.status === 'Pending');

  const handleUploadReport = (e) => {
    e.preventDefault();
    if (!resultValue.trim()) {
      showToast('Please specify observed test value or metrics', 'error');
      return;
    }
    uploadLabReport(selectedTest.id, resultValue, remarks, fileName);
    setActiveTab('Dashboard');
  };

  // 1. Lab Workbench Dashboard
  if (activeTab === 'Dashboard' || activeTab === 'Test Requests') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Pathology Laboratory Workbench
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rahul Mehta • Diagnostic testing, specimen verification & PDF report fulfillment
          </p>
        </div>

        {/* 3 Restrained Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Pending Requests</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
              {pendingTests.length > 0 ? pendingTests.length : 6}
            </div>
            <div className="mt-1 text-[11px] text-amber-800 font-medium">Awaiting specimen analysis</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Completed Today</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">24</div>
            <div className="mt-1 text-[11px] text-emerald-700 font-medium">Verified by Lab In-charge</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Uploaded Reports</span>
              <FileUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">20</div>
            <div className="mt-1 text-[11px] text-slate-400">Linked to patient EMR</div>
          </div>
        </div>

        {/* Pending Requests Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Diagnostic Test Requests</h2>
            <span className="text-xs text-slate-400">Awaiting specimen results & PDF upload</span>
          </div>

          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Request ID</th>
                <th className="py-3 px-5">Patient Name</th>
                <th className="py-3 px-5">Patient ID</th>
                <th className="py-3 px-5">Diagnostic Test</th>
                <th className="py-3 px-5">Requested By</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {labReports.map((lab) => (
                <tr key={lab.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-blue-600 text-xs">{lab.id}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900 text-xs">{lab.patientName}</td>
                  <td className="py-3.5 px-5 font-mono text-[11px] text-slate-400">{lab.patientId}</td>
                  <td className="py-3.5 px-5 font-medium text-slate-800 text-xs">{lab.test}</td>
                  <td className="py-3.5 px-5 text-slate-500 text-xs">{lab.requestedBy}</td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      lab.status === 'Completed' 
                        ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' 
                        : 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]'
                    }`}>
                      {lab.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {lab.status === 'Pending' ? (
                      <button
                        onClick={() => {
                          setSelectedTest(lab);
                          setActiveTab('Laboratory Reports');
                        }}
                        className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
                      >
                        Enter Results
                      </button>
                    ) : (
                      <button
                        onClick={() => showToast(`Opening ${lab.filePath}`)}
                        className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        View Report &rarr;
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 2. Laboratory Report Upload Form
  if (activeTab === 'Laboratory Reports') {
    return (
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Laboratory Report Upload
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Attach finalized diagnostic report to an active clinical test order
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          {/* Order Details Header */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 mb-5 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <strong className="text-slate-900">{selectedTest?.patientName} ({selectedTest?.patientId})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Test Ordered:</span>
              <strong className="text-blue-700 font-semibold">{selectedTest?.test}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Order ID:</span>
              <span className="font-mono text-slate-700">{selectedTest?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Requested By:</span>
              <span className="text-slate-700">{selectedTest?.requestedBy}</span>
            </div>
          </div>

          <form onSubmit={handleUploadReport} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Observed Test Values & Quantitative Result <span className="text-rose-500">*</span>
              </label>
              <textarea 
                value={resultValue} 
                onChange={(e) => setResultValue(e.target.value)} 
                rows="2" 
                required
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono" 
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Pathologist Clinical Remarks
              </label>
              <input 
                type="text" 
                value={remarks} 
                onChange={(e) => setRemarks(e.target.value)} 
                className="w-full px-3.5 h-10 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
              />
            </div>

            {/* PDF File Upload Zone */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Attach Diagnostic PDF Document
              </label>
              <div 
                onClick={() => {
                  setFileAttached(true);
                  showToast('PDF file attached: Finalized_Pathology_Report.pdf');
                }}
                className="p-6 border border-dashed border-slate-300 hover:border-blue-500 rounded-lg bg-slate-50 hover:bg-blue-50/20 text-center transition-colors cursor-pointer"
              >
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                <div className="text-xs font-semibold text-slate-800">
                  {fileAttached ? fileName : 'Choose PDF file or drag and drop here'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Standard application/pdf format (Max 5MB)
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Immediately updates Patient EMR & Doctor clinical view
              </span>
              <button 
                type="submit" 
                className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Upload Report & Mark Completed
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
};
