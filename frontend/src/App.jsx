import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { WorkflowModal } from './components/modals/WorkflowModal';
import { LoginPage } from './pages/LoginPage';
import { DashboardView } from './pages/DashboardView';
import { PatientsView } from './pages/PatientsView';
import { AppointmentsView } from './pages/AppointmentsView';
import { OpdConsultationView } from './pages/OpdConsultationView';
import { LaboratoryView } from './pages/LaboratoryView';
import { PharmacyView } from './pages/PharmacyView';
import { InpatientWardsView } from './pages/InpatientWardsView';
import { ReportsAnalyticsView } from './pages/ReportsAnalyticsView';
import { SettingsView } from './pages/SettingsView';
import { DesignSystemWorkspace } from './pages/DesignSystemWorkspace';
import { CheckCircle2, AlertCircle, ShieldAlert, ArrowLeft, LogOut, Info } from 'lucide-react';

const MainApplication = () => {
  const { 
    isAuthenticated, 
    activeTab, 
    setActiveTab,
    currentRole, 
    isAuthorizedTab, 
    viewMode, 
    toastMessage,
    logout 
  } = useHospital();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Render content based on dynamic RBAC permissions
  const renderWorkspaceContent = () => {
    if (viewMode === 'design_system') {
      return <DesignSystemWorkspace />;
    }

    // Dynamic security boundary: Check if active session role has clearance for activeTab
    if (!isAuthorizedTab(activeTab)) {
      return (
        <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-12 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6 border border-rose-100 shadow-2xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 mb-4">
            Security Exception • 403 Forbidden
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Restricted Access - Unauthorized
          </h2>
          
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-lg mx-auto mb-6">
            Your active session role (<strong className="text-slate-900 font-semibold">{currentRole}</strong>) does not possess clearance to access the <strong className="text-slate-900 font-semibold">{activeTab}</strong> workspace. Under strict Role-Based Access Control (RBAC) and Data Minimization directives, all unauthorized views are strictly blocked.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-md mx-auto mb-8 text-xs text-slate-600 space-y-1 text-left">
            <div className="font-semibold text-slate-800">Operational Policy: Zero Information Leakage</div>
            <div>Only actors with explicit clearance can query or manipulate records in this department.</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('Dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl transition-colors cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to My Dashboard</span>
            </button>
            <button
              onClick={logout}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-2xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Sign Out & Switch Account</span>
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'Dashboard':
        return <DashboardView />;
      case 'Patients':
        return <PatientsView />;
      case 'Appointments':
        return <AppointmentsView />;
      case 'OPD & Consultation':
        return <OpdConsultationView />;
      case 'Laboratory':
        return <LaboratoryView />;
      case 'Pharmacy':
        return <PharmacyView />;
      case 'Inpatient / Wards':
        return <InpatientWardsView />;
      case 'Reports':
        return <ReportsAnalyticsView />;
      case 'Settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Deep Navy Left Navigation (248px) */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 px-8 sm:px-10 lg:px-12 xl:px-16 pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-24 max-w-[1520px] w-full mx-auto">
          {renderWorkspaceContent()}
        </main>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-lg text-xs font-medium border border-slate-700">
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : toastMessage.type === 'info' ? (
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Global Interactive Workflow Showcase Modal */}
      <WorkflowModal />
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <MainApplication />
    </HospitalProvider>
  );
}
