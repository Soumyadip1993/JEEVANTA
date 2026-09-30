import { useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { initialData } from '../../data/mockDatabase';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Bed, 
  FileBarChart, 
  Settings,
  Building2,
  LogOut,
  UserPlus,
  X
} from 'lucide-react';

export const Sidebar = () => {
  const { 
    currentRole, 
    activeTab, 
    setActiveTab, 
    setViewMode, 
    logout,
    isAuthorizedTab,
    isSidebarOpen,
    setIsSidebarOpen
  } = useHospital();

  // Close sidebar on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, setIsSidebarOpen]);

  // Tab definitions dictionary with icons and role-tailored terminology
  const tabRegistry = {
    'Dashboard': {
      icon: LayoutDashboard,
      defaultLabel: `${currentRole} Dashboard`,
      roleLabels: {
        'Doctor': 'Doctor Dashboard',
        'Receptionist': 'Reception Dashboard',
        'Nurse': 'Ward & Vitals Overview',
        'Laboratory Technician': 'Laboratory Workbench',
        'Pharmacist': 'Pharmacy Dashboard',
        'Administrator': 'Hospital Command Center',
        'Patient': 'My Health Overview'
      }
    },
    'OPD & Consultation': {
      icon: Stethoscope,
      defaultLabel: 'OPD & Consultation',
      roleLabels: {
        'Doctor': 'OPD & Consultation'
      }
    },
    'Appointments': {
      icon: Calendar,
      defaultLabel: 'Appointments',
      roleLabels: {
        'Doctor': 'My Appointments',
        'Receptionist': 'Book Appointment',
        'Patient': 'Book Appointment'
      }
    },
    'Patients': {
      icon: currentRole === 'Receptionist' ? UserPlus : Users,
      defaultLabel: 'Patient Records',
      roleLabels: {
        'Doctor': 'Patient EMR & History',
        'Receptionist': 'Patient Registration & Records',
        'Nurse': 'Inpatient Health Records',
        'Laboratory Technician': 'Patient Specimen Records',
        'Pharmacist': 'Patient Medication Records',
        'Patient': 'My Medical Records'
      }
    },
    'Laboratory': {
      icon: FlaskConical,
      defaultLabel: 'Laboratory',
      roleLabels: {
        'Doctor': 'Diagnostic Lab Reports',
        'Laboratory Technician': 'Lab Reports & CBC Tests',
        'Patient': 'My Lab Results'
      }
    },
    'Pharmacy': {
      icon: Pill,
      defaultLabel: 'Pharmacy Inventory',
      roleLabels: {
        'Pharmacist': 'Medicine Inventory & Stock',
        'Administrator': 'Pharmacy Stock Telemetry'
      }
    },
    'Inpatient / Wards': {
      icon: Bed,
      defaultLabel: 'Inpatient & Wards',
      roleLabels: {
        'Doctor': 'Inpatient Bed Rounds',
        'Receptionist': 'Bed Availability Lookup',
        'Nurse': 'Ward Management & Beds',
        'Administrator': 'Bed Occupancy Telemetry'
      }
    },
    'Reports': {
      icon: FileBarChart,
      defaultLabel: 'Reports & Analytics',
      roleLabels: {
        'Administrator': 'Reports & Analytics'
      }
    },
    'Settings': {
      icon: Settings,
      defaultLabel: 'Settings & Governance',
      roleLabels: {
        'Administrator': 'Settings & Governance'
      }
    }
  };

  // Dynamically derive authorized navigation items for ANY role defined in initialData
  const authorizedTabIds = initialData.roleAuthorizedTabs?.[currentRole] || ['Dashboard'];
  const navItems = authorizedTabIds
    .filter((tabId) => isAuthorizedTab(tabId) && tabRegistry[tabId])
    .map((tabId) => {
      const entry = tabRegistry[tabId];
      const label = entry.roleLabels?.[currentRole] || entry.defaultLabel;
      return {
        id: tabId,
        label,
        icon: entry.icon
      };
    });

  // Role badges & icons
  const roleDisplay = {
    'Doctor': { label: 'Doctor Workspace', icon: '🩺' },
    'Receptionist': { label: 'Reception Workspace', icon: '📋' },
    'Nurse': { label: 'Nurse Workspace', icon: '👩‍⚕️' },
    'Laboratory Technician': { label: 'Lab Technician Workspace', icon: '🧪' },
    'Pharmacist': { label: 'Pharmacy Workspace', icon: '💊' },
    'Administrator': { label: 'Admin Workspace', icon: '🏢' },
    'Patient': { label: 'Patient Portal', icon: '👤' }
  }[currentRole] || { label: `${currentRole} Workspace`, icon: '🏥' };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setViewMode('workspace');
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Backdrop Blur Overlay */}
      <div 
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 transition-opacity duration-300 ease-in-out ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Target Element: aside:nth-of-type(1) - Opens via Hamburger Icon */}
      <aside 
        className={`fixed inset-y-0 left-0 w-[300px] sm:w-[330px] bg-[#0C1E33] z-50 flex flex-col justify-between h-full select-none text-slate-300 shadow-2xl transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigation Sidebar"
      >
        <div className="flex flex-col">
          {/* Header with Brand & Close Button */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                ✚
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-white tracking-tight text-base block leading-tight">
                  Jeevanta
                </span>
                <span className="text-xs text-slate-400 tracking-normal block leading-tight mt-0.5">
                  Government Hospital
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close navigation menu"
              title="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Workspace Badge with Generous Padding */}
          <div className="px-5 pt-6 pb-3">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/60 flex items-center gap-3.5">
              <span className="text-2xl shrink-0">{roleDisplay.icon}</span>
              <div className="overflow-hidden">
                <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                  Active Workspace
                </div>
                <div className="text-sm font-semibold text-white truncate mt-0.5">
                  {roleDisplay.label}
                </div>
              </div>
            </div>
          </div>

          {/* Section Label */}
          <div className="px-6 pt-4 pb-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Workspace Tools
            </div>
          </div>

          {/* Navigation Links with Spacious Height & Gaps */}
          <nav className="px-4 py-2 space-y-2 overflow-y-auto max-h-[calc(100vh-320px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full min-h-[48px] h-12 flex items-center gap-3.5 px-4 rounded-2xl text-sm transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-medium'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} strokeWidth={1.8} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer: Hospital Card & Sign Out / Switch Workspace with Ample Padding */}
        <div className="p-5 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#132742] border border-slate-700/60 text-left">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">City Government Hospital</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">Central District • Zone 4</div>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              setIsSidebarOpen(false);
            }}
            className="w-full min-h-[44px] h-11 flex items-center justify-center gap-2 px-4 rounded-2xl bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/60 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
