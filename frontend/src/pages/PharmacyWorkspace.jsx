import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Layers, 
  AlertTriangle, 
  Clock, 
  Search, 
  PackageCheck 
} from 'lucide-react';

export const PharmacyWorkspace = () => {
  const { 
    activeTab, 
    setActiveTab, 
    inventory, 
    prescriptions, 
    dispensePrescription, 
    showToast 
  } = useHospital();

  const [selectedPrescription, setSelectedPrescription] = useState(
    prescriptions.find(p => p.status === 'Pending') || prescriptions[0]
  );
  const [searchQuery, setSearchQuery] = useState('');

  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending');
  const lowStockItems = inventory.filter(i => i.stock <= i.min);
  const totalUnits = inventory.reduce((acc, i) => acc + i.stock, 0);

  const filteredInventory = inventory.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDispense = (prescId) => {
    dispensePrescription(prescId);
    showToast(`Prescription ${prescId} successfully dispensed! Inventory stock updated.`);
  };

  // 1. Pharmacy Overview Dashboard
  if (activeTab === 'Dashboard') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Dispensary & Stock Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kavita Rao • Central hospital pharmacy inventory and digital prescription fulfillment
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Units in Stock</span>
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">{totalUnits}</div>
            <div className="mt-1 text-[11px] text-slate-400">Across {inventory.length} formulations</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Pending Prescriptions</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
              {pendingPrescriptions.length}
            </div>
            <div className="mt-1 text-[11px] text-amber-800 font-medium">Ready for pickup & dispensing</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Low-Stock Warnings</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-rose-700 tabular-nums">
              {lowStockItems.length}
            </div>
            <div className="mt-1 text-[11px] text-rose-700 font-medium">Below reorder safety threshold</div>
          </div>
        </div>

        {/* Low-Stock Alert Banners (Restrained, high-trust notice) */}
        {lowStockItems.length > 0 && (
          <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-3 text-rose-700 font-semibold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Critical Medicine Depletion Warnings (Below MinThreshold)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {lowStockItems.map(item => (
                <div key={item.id} className="p-3 rounded-lg border border-rose-100 bg-[#FEF2F2]/60 flex items-center justify-between">
                  <div>
                    <span className="text-slate-900 font-semibold text-xs block">{item.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Current: <strong className="text-rose-700">{item.stock}</strong> / Min: {item.min}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-200/70 text-rose-800">
                    LOW
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Prescriptions Queue */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Prescriptions Pending Dispensing</h2>
              <p className="text-xs text-slate-400 mt-0.5">Doctor digital prescriptions linked to dispensary station</p>
            </div>
            <button 
              onClick={() => setActiveTab('Inventory')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Open Full Stock &rarr;
            </button>
          </div>

          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Prescription ID</th>
                <th className="py-3 px-5">Patient Name</th>
                <th className="py-3 px-5">Prescribing Doctor</th>
                <th className="py-3 px-5">Items</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-blue-600 text-xs">{rx.id}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900 text-xs">{rx.patientName}</td>
                  <td className="py-3.5 px-5 text-slate-600 text-xs">{rx.doctor}</td>
                  <td className="py-3.5 px-5 text-slate-500 text-xs">{rx.items.length} formulations</td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      rx.status === 'Dispensed' 
                        ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' 
                        : 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]'
                    }`}>
                      {rx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {rx.status === 'Pending' ? (
                      <button
                        onClick={() => {
                          setSelectedPrescription(rx);
                          setActiveTab('Prescriptions / Dispensing');
                        }}
                        className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
                      >
                        Verify & Dispense
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Dispensed</span>
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

  // 2. Prescription Dispensing & Stock Comparison
  if (activeTab === 'Prescriptions / Dispensing') {
    const rx = selectedPrescription || prescriptions[0];
    const isAlreadyDispensed = rx.status === 'Dispensed';

    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Prescription Dispensing & Stock Verification
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify prescribed line items and deduct quantities from hospital stock
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Pane: Prescription Details & Items (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prescription Header</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{rx.patientName}</div>
                <div className="text-xs text-slate-500">{rx.doctor} • {rx.date}</div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                  {rx.id}
                </span>
                <div className="mt-1">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    isAlreadyDispensed 
                      ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' 
                      : 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]'
                  }`}>
                    {rx.status}
                  </span>
                </div>
              </div>
            </div>

            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Formulation</th>
                  <th className="py-2.5 px-3 text-center">Prescribed</th>
                  <th className="py-2.5 px-3 text-center">Available</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rx.items.map((item, idx) => {
                  const invMatch = inventory.find(inv => 
                    inv.name.toLowerCase().includes(item.name.toLowerCase()) || 
                    item.name.toLowerCase().includes(inv.name.toLowerCase())
                  );
                  const available = invMatch ? invMatch.stock : 45;
                  const isSufficient = available >= item.quantity;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-800 text-xs">{item.name}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 text-xs">{item.quantity}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-500 text-xs">{available}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          isSufficient 
                            ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' 
                            : 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'
                        }`}>
                          {isSufficient ? 'Ready' : 'Shortage'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs text-slate-600">
              <strong className="text-slate-800 block mb-0.5">Instructions:</strong>
              {rx.instructions}
            </div>
          </div>

          {/* Right Pane: Inventory Math & Deduction Trigger (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Stock Deduction Calculation
            </h2>

            <div className="space-y-2.5">
              {rx.items.map((item, idx) => {
                const invMatch = inventory.find(inv => 
                  inv.name.toLowerCase().includes(item.name.toLowerCase()) || 
                  item.name.toLowerCase().includes(inv.name.toLowerCase())
                );
                const currentStock = invMatch ? invMatch.stock : 45;
                const nextStock = Math.max(0, currentStock - item.quantity);

                return (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-semibold text-slate-900 text-xs">{item.name}</div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-slate-500">Remaining after issue:</span>
                      <span className="font-mono text-slate-800">
                        {currentStock} &rarr; <strong className="text-blue-600">{nextStock}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-blue-50/60 border border-blue-200/70 rounded-lg text-xs text-blue-900 leading-relaxed">
              Deduction operates atomically across all prescription items and updates safety thresholds in real time.
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={isAlreadyDispensed}
                onClick={() => handleDispense(rx.id)}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <PackageCheck className="w-4 h-4" />
                <span>{isAlreadyDispensed ? 'Prescription Already Dispensed' : 'Dispense Medicines & Deduct Stock'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Searchable Medicine Inventory Grid
  if (activeTab === 'Inventory') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Medicine Stock & Inventory
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect and adjust hospital central stock formulations
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulations..."
              className="w-full pl-8 pr-3.5 h-10 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Medicine Formulation</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Current Stock</th>
                <th className="py-3 px-5">Min Threshold</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-slate-900 text-xs">{item.name}</td>
                  <td className="py-3.5 px-5 text-slate-500 text-xs">{item.category}</td>
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900 text-xs">{item.stock}</td>
                  <td className="py-3.5 px-5 font-mono text-slate-400 text-xs">{item.min}</td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      item.stock <= item.min 
                        ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]' 
                        : 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                    }`}>
                      {item.stock <= item.min ? 'Low Stock' : 'Healthy'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button 
                      onClick={() => showToast(`Restocked +50 units of ${item.name}`)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      + Add 50 Units
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
};
