/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { initialData } from '../data/mockDatabase';

const HospitalContext = createContext(null);

export const HospitalProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState('Doctor');
  const [currentUser, setCurrentUser] = useState({
    name: 'Dr. Ananya Sharma',
    id: 'DOC-101',
    role: 'Doctor',
    email: 'ananya.sharma@jeevanta.gov'
  });
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [viewMode, setViewMode] = useState('workspace'); // 'workspace' | 'design_system'
  
  // Data states
  const [patients, setPatients] = useState(initialData.patientsList);
  const [primaryPatient] = useState(initialData.primaryPatient);
  const [queue, setQueue] = useState(initialData.queue);
  const [clinicalTimeline, setClinicalTimeline] = useState(initialData.clinicalTimeline);
  const [prescriptions, setPrescriptions] = useState(initialData.prescriptions);
  const [labReports, setLabReports] = useState(initialData.labReports);
  const [inventory, setInventory] = useState(initialData.inventory);
  const [wards, setWards] = useState(initialData.wards);
  const [vitalsLogs, setVitalsLogs] = useState(initialData.vitalsLogs);
  const [staff, setStaff] = useState(initialData.staff);
  const [auditLogs, setAuditLogs] = useState(initialData.auditLogs);
  const [toastMessage, setToastMessage] = useState(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [deviceMode, setDeviceMode] = useState('auto'); // 'auto' | 'mobile' | 'tablet' | 'laptop' | 'desktop'
  const isMobileNavOpen = isSidebarOpen;
  const setIsMobileNavOpen = setIsSidebarOpen;

  const toggleSidebar = () => {
    // If mobile viewport or mobile deviceMode
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen((prev) => !prev);
    } else {
      setDesktopSidebarCollapsed((prev) => !prev);
    }
  };

  const showToast = (msgOrObj, fallbackType = 'success') => {
    if (typeof msgOrObj === 'object' && msgOrObj !== null) {
      setToastMessage({
        message: msgOrObj.message || '',
        type: msgOrObj.type || 'info'
      });
    } else {
      setToastMessage({
        message: String(msgOrObj || ''),
        type: fallbackType
      });
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Login handler
  const login = (userId, password, workspace) => {
    const role = workspace || 'Doctor';
    setCurrentRole(role);
    setActiveTab('Dashboard');
    setViewMode('workspace');

    switch (role) {
      case 'Doctor':
        setCurrentUser({ name: 'Dr. Ananya Sharma', id: userId || 'DOC-101', role: 'Doctor', email: 'ananya.sharma@jeevanta.gov' });
        break;
      case 'Receptionist':
        setCurrentUser({ name: 'Priya Patel', id: userId || 'REC-001', role: 'Receptionist', email: 'priya.patel@jeevanta.gov' });
        break;
      case 'Nurse':
        setCurrentUser({ name: 'Nurse Sunita Rao', id: userId || 'NUR-001', role: 'Nurse', email: 'sunita.rao@jeevanta.gov' });
        break;
      case 'Laboratory Technician':
        setCurrentUser({ name: 'Rahul Mehta', id: userId || 'LAB-001', role: 'Laboratory Technician', email: 'rahul.mehta@jeevanta.gov' });
        break;
      case 'Pharmacist':
        setCurrentUser({ name: 'Kavita Sharma', id: userId || 'PHARM-001', role: 'Pharmacist', email: 'kavita.sharma@jeevanta.gov' });
        break;
      case 'Administrator':
        setCurrentUser({ name: 'Rajesh Verma', id: userId || 'ADM-001', role: 'Administrator', email: 'admin@jeevanta.gov' });
        break;
      case 'Patient':
        setCurrentUser({ name: 'Ramesh Kumar', id: userId || 'P1001', role: 'Patient', email: 'ramesh@example.com' });
        break;
      default:
        setCurrentUser({ name: 'Dr. Ananya Sharma', id: 'DOC-101', role: 'Doctor', email: 'ananya.sharma@jeevanta.gov' });
    }

    setIsAuthenticated(true);
    showToast(`Signed into ${role} Workspace successfully!`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Signed out of workspace', 'info');
  };

  // Universal Dynamic RBAC Permission Checkers
  const hasPermission = (permission) => {
    if (!currentRole || !permission) return false;
    const permissions = initialData.rolePermissions?.[currentRole] || [];
    if (Array.isArray(permission)) {
      return permission.some((p) => permissions.includes(p));
    }
    return permissions.includes(permission);
  };

  const isAuthorizedTab = (tab) => {
    if (!currentRole || !tab) return false;
    const allowed = initialData.roleAuthorizedTabs?.[currentRole] || [];
    return allowed.includes(tab);
  };

  const authorizedTabs = initialData.roleAuthorizedTabs?.[currentRole] || ['Dashboard'];

  // Switch role and update default user profile & active tab
  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    setActiveTab('Dashboard');
    
    switch (newRole) {
      case 'Patient':
        setCurrentUser({ name: 'Ramesh Kumar', id: 'P1001', role: 'Patient', email: 'ramesh@example.com' });
        break;
      case 'Receptionist':
        setCurrentUser({ name: 'Priya Patel', id: 'REC-001', role: 'Receptionist', email: 'priya.patel@jeevanta.gov' });
        break;
      case 'Doctor':
        setCurrentUser({ name: 'Dr. Ananya Sharma', id: 'DOC-101', role: 'Doctor', email: 'ananya.sharma@jeevanta.gov' });
        break;
      case 'Nurse':
        setCurrentUser({ name: 'Nurse Sunita Rao', id: 'NUR-001', role: 'Nurse', email: 'sunita.rao@jeevanta.gov' });
        break;
      case 'Laboratory Technician':
        setCurrentUser({ name: 'Rahul Mehta', id: 'LAB-001', role: 'Laboratory Technician', email: 'rahul.mehta@jeevanta.gov' });
        break;
      case 'Pharmacist':
        setCurrentUser({ name: 'Kavita Sharma', id: 'PHARM-001', role: 'Pharmacist', email: 'kavita.sharma@jeevanta.gov' });
        break;
      case 'Administrator':
        setCurrentUser({ name: 'Rajesh Verma', id: 'ADM-001', role: 'Administrator', email: 'admin@jeevanta.gov' });
        break;
      default:
        setCurrentUser({ name: 'Dr. Ananya Sharma', id: 'DOC-101', role: 'Doctor', email: 'ananya.sharma@jeevanta.gov' });
    }
    showToast(`Switched workspace to ${newRole}`);
  };

  // 1. Patient Registration (Receptionist)
  const registerPatient = (patientData) => {
    const nextSeq = 129 + patients.length;
    const newId = `PID-PL00${nextSeq}`;
    const newPatient = {
      id: newId,
      name: patientData.name || 'New Patient',
      age: patientData.age || 28,
      gender: patientData.gender || 'Female',
      phone: patientData.phone || '9876543219',
      department: patientData.department || 'General Medicine',
      status: 'Waiting'
    };
    setPatients(prev => [newPatient, ...prev]);

    // Automatically issue a token into queue
    const tokenSeq = `GM-00${queue.length + 1}`;
    const newQueueItem = {
      token: tokenSeq,
      patient: newPatient.name,
      patientId: newId,
      time: '10:45',
      status: 'Waiting',
      stage: 'waiting'
    };
    setQueue(prev => [...prev, newQueueItem]);

    // Record audit log
    setAuditLogs(prev => [{
      logId: Date.now(),
      user: currentUser.email,
      role: currentRole,
      action: `REGISTER_PATIENT: ${newId} (${newPatient.name})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }, ...prev]);

    showToast(`Patient registered! Generated ${newId} & Token ${tokenSeq}`);
    return newId;
  };

  // 2. Queue Stage Transition (Receptionist & Doctor)
  const advanceQueueToken = (tokenNumber, targetStage) => {
    setQueue(prev => prev.map(item => {
      if (item.token === tokenNumber) {
        let newStatus = 'Waiting';
        if (targetStage === 'in_consultation') newStatus = 'In consultation';
        if (targetStage === 'completed') newStatus = 'Completed';
        return { ...item, stage: targetStage, status: newStatus };
      }
      return item;
    }));
    showToast(`Token ${tokenNumber} moved to ${targetStage.replace('_', ' ')}`);
  };

  // 3. Clinical Consultation & Prescription (Doctor)
  const saveConsultation = ({ patientId, chiefComplaint, diagnosis, notes, requestedLabTests }) => {
    const newRecordId = `CR-${Date.now().toString().slice(-4)}`;
    const newRecord = {
      id: newRecordId,
      date: '15 Sep 2026',
      type: 'Consultation',
      title: diagnosis || 'Clinical Consultation',
      doctor: 'Dr. Amit Sharma',
      notes: notes || chiefComplaint
    };
    setClinicalTimeline(prev => [newRecord, ...prev]);

    // If lab tests requested, create pending test orders
    if (requestedLabTests && requestedLabTests.length > 0) {
      requestedLabTests.forEach((testName, idx) => {
        const testId = `LAB-REQ-${204 + labReports.length + idx}`;
        const newLabOrder = {
          id: testId,
          patientId: patientId || 'PID-PL00123',
          patientName: 'Astha Sharma',
          test: testName,
          requestedBy: 'Dr. Amit Sharma',
          requestDate: '15 Sep 2026',
          status: 'Pending',
          metrics: [],
          remarks: 'Awaiting lab technician processing.',
          filePath: null
        };
        setLabReports(prev => [newLabOrder, ...prev]);
      });
    }

    setAuditLogs(prev => [{
      logId: Date.now(),
      user: currentUser.email,
      role: currentRole,
      action: `SAVE_CONSULTATION: ${patientId} (${diagnosis})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }, ...prev]);

    showToast(`Consultation saved & EMR updated successfully`);
  };

  // 4. Create Prescription (Doctor)
  const createPrescription = ({ patientId, patientName, items, instructions }) => {
    const newPrescId = `RX-2026-${(prescriptions.length + 144).toString()}`;
    const newPrescription = {
      id: newPrescId,
      patientId: patientId || 'PID-PL00123',
      patientName: patientName || 'Astha Sharma',
      doctor: 'Dr. Amit Sharma',
      department: 'General Medicine',
      date: '15 Sep 2026',
      status: 'Pending',
      instructions: instructions || 'Take medicines after food.',
      items: items
    };
    setPrescriptions(prev => [newPrescription, ...prev]);

    setAuditLogs(prev => [{
      logId: Date.now(),
      user: currentUser.email,
      role: currentRole,
      action: `CREATE_PRESCRIPTION: ${newPrescId} (${items.length} items)`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }, ...prev]);

    showToast(`Prescription ${newPrescId} sent to Pharmacy!`);
  };

  // 5. Dispense Prescription & Deduct Inventory (Pharmacist)
  const dispensePrescription = (prescriptionId) => {
    const targetPresc = prescriptions.find(p => p.id === prescriptionId);
    if (!targetPresc) return;

    // Atomic stock deduction
    setInventory(prev => prev.map(invItem => {
      const match = targetPresc.items.find(item => item.name.toLowerCase().includes(invItem.name.toLowerCase()) || invItem.name.toLowerCase().includes(item.name.toLowerCase()));
      if (match) {
        const newStock = Math.max(0, invItem.stock - match.quantity);
        return {
          ...invItem,
          stock: newStock,
          status: newStock <= invItem.min ? 'Low Stock' : 'Healthy'
        };
      }
      return invItem;
    }));

    // Mark prescription dispensed
    setPrescriptions(prev => prev.map(p => {
      if (p.id === prescriptionId) return { ...p, status: 'Dispensed' };
      return p;
    }));

    setAuditLogs(prev => [{
      logId: Date.now(),
      user: currentUser.email,
      role: currentRole,
      action: `DISPENSE_PRESCRIPTION: ${prescriptionId}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }, ...prev]);

    showToast(`Prescription ${prescriptionId} dispensed! Stock updated.`);
  };

  // 6. Upload Laboratory Report (Lab Tech)
  const uploadLabReport = (testId, resultValue, remarks, fileName) => {
    setLabReports(prev => prev.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          status: 'Completed',
          remarks: remarks || 'Specimen processed successfully.',
          filePath: fileName || `${test.test}_Report_${test.patientId}.pdf`,
          metrics: [
            { test: 'Observed Value', result: resultValue || '13.4', unit: 'standard units', normal: 'Normal Reference Range' }
          ]
        };
      }
      return test;
    }));

    setAuditLogs(prev => [{
      logId: Date.now(),
      user: currentUser.email,
      role: currentRole,
      action: `UPLOAD_LAB_REPORT: ${testId}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }, ...prev]);

    showToast(`Lab report uploaded & marked Completed!`);
  };

  // 7. Ward Bed Admission & Discharge (Nurse)
  const admitPatientToBed = (wardId, bedId, patientName, patientId, diagnosis) => {
    setWards(prev => prev.map(ward => {
      if (ward.wardId === wardId) {
        const updatedBeds = ward.beds.map(bed => {
          if (bed.bedId === bedId) {
            return {
              ...bed,
              status: 'Occupied',
              patientName: patientName,
              patientId: patientId,
              admissionDate: '15 Sep 2026',
              diagnosis: diagnosis || 'Under Observation'
            };
          }
          return bed;
        });
        const occupied = updatedBeds.filter(b => b.status === 'Occupied').length;
        return {
          ...ward,
          beds: updatedBeds,
          occupied: occupied,
          available: ward.totalBeds - occupied
        };
      }
      return ward;
    }));
    showToast(`Patient ${patientName} admitted to ${bedId}`);
  };

  const dischargePatientFromBed = (wardId, bedId) => {
    setWards(prev => prev.map(ward => {
      if (ward.wardId === wardId) {
        const updatedBeds = ward.beds.map(bed => {
          if (bed.bedId === bedId) {
            return {
              ...bed,
              status: 'Free',
              patientName: null,
              patientId: null,
              admissionDate: null,
              diagnosis: null
            };
          }
          return bed;
        });
        const occupied = updatedBeds.filter(b => b.status === 'Occupied').length;
        return {
          ...ward,
          beds: updatedBeds,
          occupied: occupied,
          available: ward.totalBeds - occupied
        };
      }
      return ward;
    }));
    showToast(`Patient discharged. ${bedId} is now Free!`);
  };

  // 8. Record Vitals (Nurse)
  const recordVitals = ({ bedId, patientName, temperature, bp, pulse, notes }) => {
    const newVital = {
      id: `VIT-${Date.now().toString().slice(-4)}`,
      bedId,
      patientName: patientName || 'Admitted Patient',
      timestamp: '15 Sep 2026 • Current',
      temperature: parseFloat(temperature) || 98.6,
      bp: bp || '120/80',
      pulse: parseInt(pulse) || 72,
      notes: notes || 'Stable and comfortable'
    };
    setVitalsLogs(prev => [newVital, ...prev]);
    showToast(`Vitals logged for ${bedId}!`);
  };

  // 9. Staff Provisioning (Administrator)
  const addStaffMember = (staffData) => {
    const newStaff = {
      id: staffData.employeeId || staffData.id || `STF-${(staff.length + 1).toString().padStart(2, '0')}`,
      name: staffData.name,
      role: staffData.role,
      dept: staffData.dept || (
        staffData.role === 'Doctor' ? 'General Medicine' :
        staffData.role === 'Nurse' ? 'Inpatient Ward & Nursing' :
        staffData.role === 'Pharmacist' ? 'Central Pharmacy' :
        staffData.role === 'Laboratory Technician' ? 'Diagnostic Pathology Lab' :
        staffData.role === 'Receptionist' ? 'Front Desk & OPD Triage' : 'Hospital Administration'
      ),
      email: staffData.email || `${staffData.name.toLowerCase().replace(/\s+/g, '.')}@jeevanta.gov`,
      phone: staffData.phone || '9876500099',
      status: 'Active'
    };
    setStaff(prev => [newStaff, ...prev]);
    if (initialData.staff) {
      initialData.staff.unshift(newStaff);
    }

    setAuditLogs(prev => [{
      logId: Date.now(),
      user: currentUser?.email || 'admin@jeevanta.gov',
      role: currentRole || 'Administrator',
      action: `ADMIN_REGISTER_STAFF: ${newStaff.id} (${newStaff.name} - ${newStaff.role})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }, ...prev]);

    showToast(`Staff member ${newStaff.name} (${newStaff.role}) registered successfully!`);
    return newStaff;
  };

  // 10. Public Patient Self-Registration (LoginPage)
  const registerAndLoginPatient = ({ name, phone, password }) => {
    const nextSeq = 1000 + patients.length + 1;
    const newId = `P${nextSeq}`;
    const newPatient = {
      id: newId,
      name: name || 'New Patient',
      age: 28,
      gender: 'General',
      phone: phone || '9876543210',
      hasPassword: Boolean(password),
      lastVisit: 'Today (Registered)',
      department: 'General Medicine',
      status: 'Active',
      email: `${(name || 'patient').toLowerCase().replace(/\s+/g, '.')}@example.com`
    };

    // Append to live context state & mockDatabase
    setPatients(prev => [newPatient, ...prev]);
    if (initialData.patientDirectory) {
      initialData.patientDirectory.unshift(newPatient);
    }
    if (initialData.patientsList) {
      initialData.patientsList.unshift(newPatient);
    }

    // Set authenticated active session for Patient
    setCurrentRole('Patient');
    setCurrentUser({
      name: newPatient.name,
      id: newId,
      role: 'Patient',
      email: newPatient.email,
      phone: newPatient.phone
    });
    setIsAuthenticated(true);
    setActiveTab('Dashboard');
    setViewMode('workspace');

    // Record audit log
    setAuditLogs(prev => [{
      logId: Date.now(),
      user: newPatient.email,
      role: 'Patient',
      action: `PUBLIC_PATIENT_SIGNUP: ${newId} (${newPatient.name})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }, ...prev]);

    showToast(`Account created! Welcome to your Patient Portal, ${newPatient.name}!`, 'success');
    return newPatient;
  };

  const toggleStaffStatus = (staffId) => {
    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        const newStatus = s.status === 'Active' ? 'Inactive' : 'Active';
        showToast(`Staff ${s.name} is now ${newStatus}`);
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  return (
    <HospitalContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      currentRole,
      currentUser,
      activeTab,
      setActiveTab,
      viewMode,
      setViewMode,
      switchRole,
      hasPermission,
      isAuthorizedTab,
      authorizedTabs,
      patients,
      primaryPatient,
      queue,
      clinicalTimeline,
      prescriptions,
      labReports,
      inventory,
      wards,
      vitalsLogs,
      staff,
      auditLogs,
      toastMessage,
      showToast,
      showWorkflowModal,
      setShowWorkflowModal,
      isSidebarOpen,
      setIsSidebarOpen,
      desktopSidebarCollapsed,
      setDesktopSidebarCollapsed,
      deviceMode,
      setDeviceMode,
      toggleSidebar,
      isMobileNavOpen,
      setIsMobileNavOpen,
      registerPatient,
      advanceQueueToken,
      saveConsultation,
      createPrescription,
      dispensePrescription,
      uploadLabReport,
      admitPatientToBed,
      dischargePatientFromBed,
      recordVitals,
      addStaffMember,
      toggleStaffStatus,
      registerAndLoginPatient
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) throw new Error('useHospital must be used within HospitalProvider');
  return context;
};
