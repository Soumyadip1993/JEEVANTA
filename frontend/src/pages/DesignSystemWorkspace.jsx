import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Sparkles, 
  AlertCircle
} from 'lucide-react';

export const DesignSystemWorkspace = () => {
  const { showToast, switchRole } = useHospital();
  const [activeSection, setActiveSection] = useState('overview');
  const [sampleInputVal, setSampleInputVal] = useState('Aarav Patel');
  const [sampleErrorInput, setSampleErrorInput] = useState('invalid-pid');
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);

  const triggerSkeletonTest = () => {
    setIsLoadingSkeleton(true);
    setTimeout(() => setIsLoadingSkeleton(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero / Executive Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-xs font-semibold text-blue-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Universal Digital Design System & Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Jeevanta Design Direction & System Specification
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              A modern, accessible, and high-trust design system architected for a centralized Government Hospital Management System (GHMS). Moving decisively away from cluttered, archaic enterprise portals toward calm, low-friction, human-centered public healthcare software.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => showToast('Design system tokens verified: 100% WCAG AA compliant', 'success')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer text-center"
            >
              Verify System Tokens
            </button>
            <button
              onClick={triggerSkeletonTest}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer text-center"
            >
              Simulate 150ms Skeletons
            </button>
          </div>
        </div>

        {/* Quick Nav Anchors */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-100 overflow-x-auto text-xs font-medium">
          {[
            { id: 'overview', label: '1. Aesthetic Direction' },
            { id: 'colors', label: '2. Universal Colors' },
            { id: 'typography', label: '3. Typography Scale' },
            { id: 'shell', label: '4. Application Shell' },
            { id: 'components', label: '5. Universal Components' },
            { id: 'interactions', label: '6. Motion & Feedback' },
            { id: 'governance', label: '7. Multi-Role Scalability' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: OVERALL AESTHETIC DIRECTION */}
      {(activeSection === 'overview' || activeSection === 'all') && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Overall Aesthetic Direction & Design Philosophy</h2>
              <p className="text-xs text-slate-500">Core style, guiding principles, spatial rhythms, and boundary discipline</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">Core Style</span>
              <h3 className="text-base font-semibold text-slate-900">Warm, High-Trust Minimalism</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clean SaaS utility combined with human-centered clinical calm. The visual atmosphere evokes quiet competence, safety, and reliability rather than cold bureaucratic machinery or hyper-commercial flashiness.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">Guiding Principle</span>
              <h3 className="text-base font-semibold text-slate-900">&ldquo;Less Visual Noise, Zero Friction&rdquo;</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Public hospitals are naturally stressful and high-velocity environments. Jeevanta functions as an oasis of order, spaciousness, and legibility so doctors, nurses, receptionists, and citizens make zero errors.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">Density & Geometry</span>
              <h3 className="text-base font-semibold text-slate-900">16/24/32px Spatial Grid</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero claustrophobic tables or harsh black borders. Hairline 1px borders in neutral slate-200 (<code className="text-slate-800">#E2E8F0</code>), soft ambient shadows, and 8px (<code className="text-slate-800">rounded-lg</code>) to 12px (<code className="text-slate-800">rounded-xl</code>) radii.
              </p>
            </div>
          </div>

          {/* Anti-Slop Architectural Contrast Table */}
          <div className="mt-4 p-5 rounded-xl border border-slate-200 bg-white">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Architectural Contrast: Traditional GHMS vs. Jeevanta Universal Design</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400">
                    <th className="py-2.5 font-medium w-1/4">Design Dimension</th>
                    <th className="py-2.5 font-medium w-3/8 text-rose-600">Traditional Legacy Portal</th>
                    <th className="py-2.5 font-medium w-3/8 text-emerald-600">Jeevanta Modern Direction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">Visual Density</td>
                    <td className="py-3 text-slate-500">Crammed tables, heavy black borders, 4px margins</td>
                    <td className="py-3 text-slate-800 font-medium">Deliberate 16/24/32px spacing, hairline dividers</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">Color Palette</td>
                    <td className="py-3 text-slate-500">Uncalibrated rainbow bars, harsh red warning boxes</td>
                    <td className="py-3 text-slate-800 font-medium">Restrained Slate + Blue 600, soft pastel semantic pills</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">Information Hierarchy</td>
                    <td className="py-3 text-slate-500">Equal visual weight on 50 fields, cognitive fatigue</td>
                    <td className="py-3 text-slate-800 font-medium">High-contrast labels, muted metadata, tabular numerals</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">Role Fragmentations</td>
                    <td className="py-3 text-slate-500">7 disparate interfaces built by different vendors</td>
                    <td className="py-3 text-slate-800 font-medium">One universal application shell across all 7 roles</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: UNIVERSAL COLOR THEME & SURFACES */}
      {(activeSection === 'colors' || activeSection === 'all') && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Universal Color Theme & Surfaces</h2>
              <p className="text-xs text-slate-500">Established Jeevanta palette with rigorous 60-30-10 distribution and WCAG AA contrast</p>
            </div>
          </div>

          {/* Color Palettes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Canvas & Surfaces */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Canvas & Surfaces</div>
              
              <div className="p-3 rounded-lg border border-slate-200 bg-[#F8FAFC]">
                <div className="text-xs font-bold text-slate-900">Canvas Background</div>
                <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                  <code>#F8FAFC</code>
                  <span>Slate 50</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs">
                <div className="text-xs font-bold text-slate-900">Primary Surface</div>
                <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                  <code>#FFFFFF</code>
                  <span>Pure White</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-[#F1F5F9]">
                <div className="text-xs font-bold text-slate-900">Secondary Surface</div>
                <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                  <code>#F1F5F9</code>
                  <span>Slate 100</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-300 bg-[#E2E8F0]">
                <div className="text-xs font-bold text-slate-900">Hairline Border</div>
                <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                  <code>#E2E8F0</code>
                  <span>Slate 200</span>
                </div>
              </div>
            </div>

            {/* Brand Accent */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Primary Brand</div>
              
              <div className="p-3 rounded-lg bg-[#2563EB] text-white">
                <div className="text-xs font-bold">Brand Primary Blue</div>
                <div className="text-[11px] text-blue-100 flex justify-between mt-1">
                  <code>#2563EB</code>
                  <span>Blue 600</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#1D4ED8] text-white">
                <div className="text-xs font-bold">Primary Hover</div>
                <div className="text-[11px] text-blue-200 flex justify-between mt-1">
                  <code>#1D4ED8</code>
                  <span>Blue 700</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-blue-200 bg-[#EFF6FF]">
                <div className="text-xs font-bold text-blue-900">Subtle Tint Fill</div>
                <div className="text-[11px] text-blue-600 flex justify-between mt-1">
                  <code>#EFF6FF</code>
                  <span>Blue 50</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-blue-300 bg-blue-100/50">
                <div className="text-xs font-bold text-blue-900">Focus Ring Hue</div>
                <div className="text-[11px] text-blue-600 flex justify-between mt-1">
                  <code>ring-blue-500/20</code>
                  <span>Accessibility</span>
                </div>
              </div>
            </div>

            {/* Typography Contrast */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Typography Hierarchy</div>
              
              <div className="p-3 rounded-lg bg-[#0F172A] text-white">
                <div className="text-xs font-bold">Headings & Labels</div>
                <div className="text-[11px] text-slate-300 flex justify-between mt-1">
                  <code>#0F172A</code>
                  <span>14.5:1 ratio</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#334155] text-white">
                <div className="text-xs font-bold">Body Text & Forms</div>
                <div className="text-[11px] text-slate-300 flex justify-between mt-1">
                  <code>#334155</code>
                  <span>9.2:1 ratio</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="text-xs font-bold text-[#64748B]">Muted Metadata</div>
                <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                  <code>#64748B</code>
                  <span>4.8:1 ratio (AA)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-slate-400">Disabled / Inactive</div>
                <div className="text-[11px] text-slate-400 flex justify-between mt-1">
                  <code>#94A3B8</code>
                  <span>Slate 400</span>
                </div>
              </div>
            </div>

            {/* Semantic Accents */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Restrained Semantics</div>
              
              <div className="p-3 rounded-lg border border-emerald-200 bg-[#ECFDF5] text-[#065F46]">
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>Success / Active</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-[11px] text-emerald-800 flex justify-between mt-1">
                  <code>#10B981</code>
                  <span>#ECFDF5 fill</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-amber-200 bg-[#FFFBEB] text-[#92400E]">
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>Warning / Pending</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                </div>
                <div className="text-[11px] text-amber-800 flex justify-between mt-1">
                  <code>#F59E0B</code>
                  <span>#FFFBEB fill</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-rose-200 bg-[#FEF2F2] text-[#991B1B]">
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>Alert / Danger</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                </div>
                <div className="text-[11px] text-rose-800 flex justify-between mt-1">
                  <code>#EF4444</code>
                  <span>#FEF2F2 fill</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-blue-200 bg-[#EFF6FF] text-[#1E40AF]">
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>Informational</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                </div>
                <div className="text-[11px] text-blue-800 flex justify-between mt-1">
                  <code>#2563EB</code>
                  <span>#EFF6FF fill</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: TYPOGRAPHY & INFORMATION HIERARCHY */}
      {(activeSection === 'typography' || activeSection === 'all') && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Typography & Information Hierarchy</h2>
              <p className="text-xs text-slate-500">Clean geometric sans-serif (Plus Jakarta Sans / Inter) with strict typographic scale</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Page Title (22px–24px, SemiBold)</span>
                <div className="text-2xl font-semibold text-slate-900">Central Outpatient Department (OPD)</div>
                <p className="text-xs text-slate-500">Used for primary page heading, dashboard headers, and major section pivots.</p>
              </div>
              <code className="text-xs bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-600 shrink-0">text-2xl font-semibold</code>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Section Header (16px–18px, Medium/SemiBold)</span>
                <div className="text-lg font-medium text-slate-900">Active Queue & Triage Status</div>
                <p className="text-xs text-slate-500">Used for panel titles, container cards, table groups, and modal heads.</p>
              </div>
              <code className="text-xs bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-600 shrink-0">text-lg font-medium</code>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Data / Body Text (14px, Regular)</span>
                <div className="text-sm font-normal text-slate-700 leading-relaxed max-w-2xl">
                  Patient registered under PID-PL00123 for General Medicine consultation. Vitals recorded: Blood Pressure 120/80 mmHg, Pulse 72 bpm, SpO2 98%.
                </div>
                <p className="text-xs text-slate-500">Form entries, descriptions, table cell records, and diagnostic clinical notes.</p>
              </div>
              <code className="text-xs bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-600 shrink-0">text-sm text-slate-700</code>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Metadata, Timestamps & Badges (12px, Medium)</span>
                <div className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                  TOKEN #04 &bull; ISSUED 09:30 AM &bull; DR. RAJESH VERMA (OPD ROOM 4)
                </div>
                <p className="text-xs text-slate-500">Captions, table column headers, helper notes, and timestamp metadata.</p>
              </div>
              <code className="text-xs bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-600 shrink-0">text-xs font-medium text-slate-500</code>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: GLOBAL APPLICATION SHELL */}
      {(activeSection === 'shell' || activeSection === 'all') && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Global Layout Shell & Navigation Framework</h2>
              <p className="text-xs text-slate-500">Strict one-shell standard: 240px Slim Left Navigation, 60px Header Utility, Fluid Content Stage</p>
            </div>
          </div>

          {/* Architectural Diagram Box */}
          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Visual Blueprint of Jeevanta Unified Application Shell
            </div>

            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-xs">
              {/* Mock Header (60px) */}
              <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="font-bold text-blue-600">✚ JEEVANTA</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-400">GHMS Central</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-900 font-semibold">Active Department Context</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>System Online</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                    U
                  </div>
                </div>
              </div>

              {/* Mock Body Split: 240px Sidebar + Content Stage */}
              <div className="flex min-h-[220px]">
                {/* 240px Left Nav */}
                <div className="w-48 bg-white border-r border-slate-200 p-3 space-y-1.5 shrink-0 text-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                    Navigation
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-700 font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span>Active Tab (Pill)</span>
                  </div>
                  <div className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <span>Secondary Module</span>
                  </div>
                  <div className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <span>Appointments</span>
                  </div>
                  <div className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <span>Records & Reports</span>
                  </div>
                </div>

                {/* Main Content Stage */}
                <div className="flex-1 bg-[#F8FAFC] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Main Content Stage</div>
                      <div className="text-[11px] text-slate-500">Consistent px-6 py-6 padding grid &bull; Max-width container &bull; No layout overflow</div>
                    </div>
                    <button 
                      onClick={() => showToast('Design specification primary action triggered')}
                      className="px-3 py-1.5 text-[11px] font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Primary Action
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <div className="text-[10px] text-slate-400 uppercase">Metric Card</div>
                      <div className="text-lg font-bold text-slate-900 tabular-nums">1,248</div>
                      <div className="text-[10px] text-emerald-600">Occupancy 72%</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <div className="text-[10px] text-slate-400 uppercase">Queue Tokens</div>
                      <div className="text-lg font-bold text-slate-900 tabular-nums">42</div>
                      <div className="text-[10px] text-blue-600">Est. wait 15m</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <div className="text-[10px] text-slate-400 uppercase">Available Beds</div>
                      <div className="text-lg font-bold text-slate-900 tabular-nums">12 / 40</div>
                      <div className="text-[10px] text-slate-500">3 wards active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: UNIVERSAL COMPONENT STYLING & PATTERNS */}
      {(activeSection === 'components' || activeSection === 'all') && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              05
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Universal Component Styling & Patterns</h2>
              <p className="text-xs text-slate-500">Standardized, reusable component kit: Cards, Form Controls, Tables, Badges, and Buttons</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Component 1: Cards & Containers */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-900">1. Standard Card Container</span>
                <span className="text-[11px] text-slate-400">Pure white, 20px padding, hairline border</span>
              </div>
              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                <div className="text-sm font-semibold text-slate-900">Card Header Title</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clean whitespace rhythms with hairline borders (<code className="text-slate-700">#E2E8F0</code>). Avoid heavy drop shadows or colored borders.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/50">
                    Standard Tag
                  </span>
                  <span className="text-xs text-slate-500">20px padding internal</span>
                </div>
              </div>
            </div>

            {/* Component 2: Form Controls & 40px Inputs */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-900">2. Form Controls (40px Height)</span>
                <span className="text-[11px] text-slate-400">Explicit top labels & blue focus ring</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Patient Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={sampleInputVal}
                    onChange={(e) => setSampleInputVal(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Enter full name..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Patient ID (PID Validation State)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={sampleErrorInput}
                      onChange={(e) => setSampleErrorInput(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-rose-50/40 border border-rose-300 rounded-lg text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                    <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3 top-3" />
                  </div>
                  <span className="text-[11px] text-rose-600 mt-1 block">PID must follow alphanumeric format PID-XXXXX</span>
                </div>
              </div>
            </div>

            {/* Component 3: Data Tables & Row Hover */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-900">3. Data Tables & Lists</span>
                <span className="text-[11px] text-slate-400">Zero vertical grid lines, muted header, hover rows</span>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Token & PID</th>
                      <th className="py-3 px-4">Patient Name</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Assigned Doctor</th>
                      <th className="py-3 px-4">Status Badge</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-900 tabular-nums">#01 &bull; PID-PL00123</td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">Astha Sharma (28, F)</td>
                      <td className="py-3.5 px-4">General Medicine</td>
                      <td className="py-3.5 px-4">Dr. Rajesh Verma</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          In Consultation
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => showToast('Sample EMR preview opened in design specification')}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          Open EMR
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-900 tabular-nums">#02 &bull; PID-WB00891</td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">Ramesh Patel (54, M)</td>
                      <td className="py-3.5 px-4">Cardiology</td>
                      <td className="py-3.5 px-4">Dr. Ananya Sen</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Waiting (Triage)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => showToast('Called patient Ramesh Patel to consultation room')}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          Call Patient
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-900 tabular-nums">#03 &bull; PID-DL00452</td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">Sunita Devi (45, F)</td>
                      <td className="py-3.5 px-4">Orthopedics</td>
                      <td className="py-3.5 px-4">Dr. Amit Shah</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          Registered
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => showToast('Expanded patient clinical file sample')}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Component 4: Button Hierarchy */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-900">4. Button Controls Hierarchy</span>
                <span className="text-[11px] text-slate-400">Compact, clear, zero oversized elements</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => showToast('Primary action button clicked')}
                  className="h-9 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Primary Action
                </button>
                <button 
                  onClick={() => showToast('Secondary action button clicked')}
                  className="h-9 px-4 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Secondary Action
                </button>
                <button 
                  onClick={() => showToast('Destructive action triggered (demo)', 'error')}
                  className="h-9 px-4 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                >
                  Destructive Action
                </button>
                <button 
                  onClick={() => showToast('Ghost text button clicked')}
                  className="h-9 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Ghost / Text
                </button>
              </div>
            </div>

            {/* Component 5: Status Badges & Pills */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-900">5. WCAG AA Soft Status Badges</span>
                <span className="text-[11px] text-slate-400">Pastel background with high-contrast text</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  Completed / Available
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                  Pending / Waiting
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200/60">
                  Occupied / Critical Alert
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200/60">
                  Scheduled / Info
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Neutral / Archived
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6: INTERACTION MODEL & MOTION LANGUAGE */}
      {(activeSection === 'interactions' || activeSection === 'all') && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              06
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Interaction Model & Motion Language</h2>
              <p className="text-xs text-slate-500">150ms transitions, skeleton loaders without layout shifts, and non-blocking toast feedback</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">Feedback Philosophy</span>
              <h4 className="text-sm font-semibold text-slate-900">Immediate, Reassuring & Subtle</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every user click must visibly acknowledge what just happened without jarring screen flashes. State changes confirm silently with micro-indicators.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">Transitions</span>
              <h4 className="text-sm font-semibold text-slate-900">150ms Cubic-Bezier</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero gratuitous bouncing or multi-second swooping. Strict 150ms duration ensures high productivity for clinical and reception staff working under speed.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">Toast Feedback</span>
              <h4 className="text-sm font-semibold text-slate-900">Bottom-Right Non-Blocking</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lightweight pop-up cards anchored at bottom-right with auto-dismiss after 3.5s. Allows uninterrupted multi-entry without blocking clicks.
              </p>
              <button
                onClick={() => showToast('Action confirmed: Prescription generated and dispatched to pharmacy', 'success')}
                className="mt-2 w-full py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Test Reassuring Toast
              </button>
            </div>
          </div>

          {/* Skeleton Loader Demo */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">Shimmering Skeleton Comparison</span>
                <span className="text-[11px] text-slate-500 block">Matches container geometry to prevent layout shift (CLS 0.0)</span>
              </div>
              <button
                onClick={triggerSkeletonTest}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {isLoadingSkeleton ? 'Simulating...' : 'Trigger Skeleton Pulse'}
              </button>
            </div>

            {isLoadingSkeleton ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5">
                  <div className="h-4 w-24 skeleton"></div>
                  <div className="h-7 w-16 skeleton"></div>
                  <div className="h-3 w-32 skeleton"></div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5">
                  <div className="h-4 w-28 skeleton"></div>
                  <div className="h-7 w-20 skeleton"></div>
                  <div className="h-3 w-36 skeleton"></div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5">
                  <div className="h-4 w-20 skeleton"></div>
                  <div className="h-7 w-14 skeleton"></div>
                  <div className="h-3 w-28 skeleton"></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500">Live OPD Queue</div>
                  <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">28 Patients</div>
                  <div className="text-[11px] text-emerald-600 mt-1">4 Doctors on duty</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500">Bed Occupancy</div>
                  <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">28 / 40 (70%)</div>
                  <div className="text-[11px] text-blue-600 mt-1">12 Beds available</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500">Pending Lab Tests</div>
                  <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">3 Samples</div>
                  <div className="text-[11px] text-amber-600 mt-1">Avg turnaround 35m</div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION 7: MULTI-ROLE SCALABILITY & GOVERNANCE */}
      {(activeSection === 'governance' || activeSection === 'all') && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              07
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Multi-Role Scalability & Design Governance</h2>
              <p className="text-xs text-slate-500">One universal system scaling identically across all 7 user roles without fragmented themes</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">The "One System, Seven Views" Principle</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hospital management software frequently suffers from catastrophic UX inconsistency: the doctor's software looks like a 2005 Windows utility, the patient portal looks like a phone app, and the pharmacy has a legacy command prompt. Jeevanta enforces an identical aesthetic, typographic scale, and component contract across all 7 roles.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Core Surface Adaptation</th>
                    <th className="py-3 px-4">Key Component Patterns Used</th>
                    <th className="py-3 px-4 text-right">Switch Live View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-semibold text-slate-900">1. Patient</td>
                    <td className="py-3 px-4">High-clarity appointment cards, download receipts, prescription lists</td>
                    <td className="py-3 px-4">Cards, Soft Status Badges, Secondary Download Buttons</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => switchRole('Patient')} className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                        Switch View &rarr;
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-semibold text-slate-900">2. Receptionist</td>
                    <td className="py-3 px-4">40px input registration forms, real-time queue tables, bed triage lookup</td>
                    <td className="py-3 px-4">Form Inputs, Token Badges, Clean Data Tables</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => switchRole('Receptionist')} className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                        Switch View &rarr;
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-semibold text-slate-900">3. Doctor</td>
                    <td className="py-3 px-4">Split-screen consultation stage, clinical timeline, rx item lists</td>
                    <td className="py-3 px-4">Hairline Split Panels, Tabular Numbers, Blue CTAs</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => switchRole('Doctor')} className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                        Switch View &rarr;
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-semibold text-slate-900">4. Nurse</td>
                    <td className="py-3 px-4">Ward bed occupancy matrix, vitals entry modal, admitted patient list</td>
                    <td className="py-3 px-4">Grid Badges, Vitals Inputs, Occupancy Pills</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => switchRole('Nurse')} className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                        Switch View &rarr;
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-semibold text-slate-900">5. Laboratory Technician</td>
                    <td className="py-3 px-4">Diagnostic request queue, result value fields, report upload dropzone</td>
                    <td className="py-3 px-4">Status Badges, Clean Tables, Upload Handlers</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => switchRole('Laboratory Technician')} className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                        Switch View &rarr;
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-semibold text-slate-900">6. Pharmacist</td>
                    <td className="py-3 px-4">Prescription dispensing queue, stock inventory counters, low-stock warnings</td>
                    <td className="py-3 px-4">Stock Warning Badges, Dispense CTAs, Tabular Numeral counters</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => switchRole('Pharmacist')} className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                        Switch View &rarr;
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-semibold text-slate-900">7. Hospital Administrator</td>
                    <td className="py-3 px-4">Hospital-wide KPI telemetry, staff role directory, RBAC governance modal</td>
                    <td className="py-3 px-4">Executive KPI Cards, Toggle Badges, Directory Tables</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => switchRole('Administrator')} className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                        Switch View &rarr;
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
