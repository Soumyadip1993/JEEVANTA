import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { initialData } from '../data/mockDatabase';
import { 
  Plus, 
  Search, 
  Filter, 
  Pill
} from 'lucide-react';

export const PharmacyView = () => {
  const { showToast, hasPermission } = useHospital();
  const [activeTab, setActiveTab] = useState('All Medicines');
  const [searchQuery, setSearchQuery] = useState('');

  const medicines = initialData.pharmacyMedicineCatalog;

  const filteredMedicines = medicines.filter(m => {
    if (activeTab === 'Low Stock') return m.status === 'Low Stock';
    if (activeTab === 'Expiring Soon') return m.expiry.includes('2026');
    return true;
  }).filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.batch.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-10 sm:space-y-12 pb-20 animate-fade-in text-slate-800">
      {/* Header with Generous Clearances */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-200/70">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 flex items-center gap-3.5 leading-snug">
            <Pill className="w-8 h-8 text-blue-600 shrink-0" />
            <span>Pharmacy & Medicine Inventory</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2 leading-relaxed">
            Real-time pharmaceutical dispensary stocks, expiry tracking & batch management
          </p>
        </div>

        {hasPermission('restock_medicine') && (
          <button
            onClick={() => showToast({ type: 'info', message: 'The Add New Medicine Stock procurement module is currently under development.' })}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Stock</span>
          </button>
        )}
      </div>

      {/* Tabs with Generous Clearance */}
      <div className="border-b border-slate-200 flex items-center gap-8 sm:gap-10 text-sm font-semibold overflow-x-auto pb-0.5">
        {['All Medicines', 'Low Stock', 'Expiring Soon'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 transition-colors border-b-2 cursor-pointer text-sm ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar with Roomy Padding */}
      <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-lg">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine by name, batch, or supplier..."
            className="w-full pl-12 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <button 
          onClick={() => showToast({ type: 'info', message: 'The Pharmacy Inventory Filter module is currently under development.' })}
          className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
        >
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Filters</span>
        </button>
      </div>

      {/* Inventory Table with Spacious Cell Padding */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-6 px-8">Medicine Name</th>
                <th className="py-6 px-8">Batch No.</th>
                <th className="py-6 px-8">Expiry Date</th>
                <th className="py-6 px-8">Stock Units</th>
                <th className="py-6 px-8">Status</th>
                <th className="py-6 px-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 leading-relaxed">
              {filteredMedicines.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-6 px-8">
                    <span className="font-semibold text-slate-900 block">{m.name}</span>
                    <span className="text-xs text-slate-400 mt-0.5">{m.category}</span>
                  </td>
                  <td className="py-6 px-8 font-mono text-slate-600 text-xs sm:text-sm">{m.batch}</td>
                  <td className="py-6 px-8 text-slate-500 tabular-nums">{m.expiry}</td>
                  <td className="py-6 px-8 font-bold text-slate-900 tabular-nums">{m.stock}</td>
                  <td className="py-6 px-8">
                    <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-medium border ${
                      m.status === 'In Stock'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right">
                    {hasPermission('restock_medicine') ? (
                      <button 
                        onClick={() => showToast(`Restock indent created for ${m.name} (+500 units)`)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Restock
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs font-mono font-medium">Read-Only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
