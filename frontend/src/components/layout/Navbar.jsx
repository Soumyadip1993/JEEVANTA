import { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  Menu,
  Search, 
  Bell, 
  ChevronDown, 
  Sliders,
  Workflow,
  LogOut,
  X,
  ShieldCheck
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentRole, 
    currentUser, 
    setShowWorkflowModal,
    viewMode,
    setViewMode,
    showToast,
    logout,
    hasPermission,
    isSidebarOpen,
    setIsSidebarOpen
  } = useHospital();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Compute clean user initials
  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const handleSignOut = () => {
    setIsUserMenuOpen(false);
    logout();
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200/90 px-6 sm:px-10 lg:px-12 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* ========================================================
          LEFT ZONE: Hamburger + Brand + Search Input
          ======================================================== */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Hamburger Menu Button: Opens Sidebar on all screen sizes */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 -ml-2 text-slate-700 hover:text-slate-900 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer min-h-[48px] min-w-[48px] flex items-center justify-center shrink-0"
          aria-label="Toggle navigation menu"
          title="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            ✚
          </div>
          <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight truncate max-w-[140px] sm:max-w-none">
            Jeevanta
          </span>
        </div>

        {/* Global Search Input (Desktop & Tablet) - Scoped by RBAC clearance */}
        {hasPermission('view_patients_directory') && (
          <div className="relative hidden md:block w-64 sm:w-80 lg:w-96 ml-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input 
              type="text" 
              placeholder="Search patients, files, staff..." 
              className="w-full pl-11 pr-16 py-2.5 text-sm bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
            />
            <span className="absolute right-3.5 top-2.5 px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-white border border-slate-200 rounded-md select-none hidden lg:inline-block">
              ⌘K
            </span>
          </div>
        )}
      </div>

      {/* ========================================================
          CENTER ZONE: Contextual info (Large screens only)
          ======================================================== */}
      <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
        <span>City Government General Hospital</span>
      </div>

      {/* ========================================================
          RIGHT ZONE: Mobile Search Toggle, Status, Alerts, Avatar & Sign Out
          ======================================================== */}
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
        {/* Mobile Search Icon Toggle - Scoped by RBAC clearance */}
        {hasPermission('view_patients_directory') && (
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-2.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </button>
        )}

        {/* System Online Status Indicator (Desktop/Tablet) */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200/80">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="hidden md:inline">System</span> Online
        </div>

        {/* Notification Bell */}
        <button 
          onClick={() => showToast('3 Unread clinical notifications')}
          className="relative p-2.5 text-slate-500 hover:text-slate-800 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer min-h-[48px] min-w-[48px] flex items-center justify-center"
          title="3 Notifications"
          aria-label="3 Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
            3
          </span>
        </button>

        {/* Direct Desktop Sign Out Button for Fast & Explicit Exit */}
        <button
          onClick={handleSignOut}
          className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-colors cursor-pointer"
          title="Sign out of current workspace"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500" />
          <span>Sign Out</span>
        </button>

        {/* User Account / Profile Menu (Strict RBAC - Fast Role Switching Removed) */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-2 rounded-2xl hover:bg-slate-100/80 transition-colors cursor-pointer text-left min-h-[48px]"
            aria-label="User profile and session menu"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs shrink-0 select-none">
              {userInitials}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                {currentUser?.name || 'User'}
              </div>
              <div className="text-[11px] text-slate-400 font-medium leading-snug mt-0.5 flex items-center gap-1">
                <span>{currentRole}</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block ml-0.5" />
          </button>

          {isUserMenuOpen && (
            <div 
              className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 z-50 animate-fade-in max-w-[calc(100vw-24px)]"
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              {/* Authenticated User Identity */}
              <div className="px-5 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Authenticated Session</span>
                </div>
                <div className="mt-2.5">
                  <div className="text-sm font-bold text-slate-900">{currentUser?.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{currentUser?.email || currentUser?.id}</div>
                </div>
                <div className="mt-2.5">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    Role: {currentRole}
                  </span>
                </div>
              </div>

              {/* Strict Security RBAC Policy Notice */}
              <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs leading-relaxed">
                <p>
                  To change roles or switch departments, please sign out and log in with the authorized credentials.
                </p>
              </div>

              {/* Utility Tools */}
              <div className="px-3 py-2 space-y-1">
                <button
                  onClick={() => {
                    setViewMode(viewMode === 'design_system' ? 'workspace' : 'design_system');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                >
                  <Sliders className="w-4 h-4 text-slate-400" />
                  <span>{viewMode === 'design_system' ? 'Back to Hospital App' : 'Design System Spec'}</span>
                </button>
                <button
                  onClick={() => {
                    setShowWorkflowModal(true);
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                >
                  <Workflow className="w-4 h-4 text-slate-400" />
                  <span>6-Step Hospital Workflow</span>
                </button>
              </div>

              {/* Sign Out Action */}
              <div className="pt-2 border-t border-slate-100 px-3">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 cursor-pointer font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {isMobileSearchOpen && (
        <div className="absolute inset-x-0 top-16 bg-white border-b border-slate-200 p-3 shadow-md md:hidden z-40 flex items-center gap-2 animate-fade-in">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search patients, files, staff..." 
              autoFocus
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button 
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 text-slate-500 hover:text-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
