/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initialData } from '../data/mockDatabase';
import api, { ApiError, authStorage } from '../services/api';

const HospitalContext = createContext(null);

const ROLE_LABELS = {
  ADMIN: 'Administrator',
  RECEPTIONIST: 'Receptionist',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  LAB_TECHNICIAN: 'Laboratory Technician',
  PHARMACIST: 'Pharmacist',
  PATIENT: 'Patient'
};

const DEFAULT_RESOURCE_STATE = {
  loading: false,
  error: null
};

const withStatusColor = (status) => {
  if (['COMPLETED', 'DISPENSED', 'AVAILABLE', 'ADMITTED'].includes(status)) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (['IN_PROGRESS', 'WAITING', 'PENDING', 'SCHEDULED'].includes(status)) {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
  if (['CANCELLED', 'NO_SHOW'].includes(status)) {
    return 'bg-rose-50 text-rose-700 border-rose-200';
  }
  return 'bg-blue-50 text-blue-700 border-blue-200';
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const calculateAge = (dob) => {
  if (!dob) return '—';
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return '—';
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const parseName = (fullName = '') => {
  const [firstName, ...rest] = String(fullName).trim().split(' ');
  return {
    firstName: firstName || 'Patient',
    lastName: rest.join(' ') || null
  };
};

export const HospitalProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState('Doctor');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [viewMode, setViewMode] = useState('workspace');

  const [resourceStates, setResourceStates] = useState({
    patients: { ...DEFAULT_RESOURCE_STATE },
    appointments: { ...DEFAULT_RESOURCE_STATE },
    clinical: { ...DEFAULT_RESOURCE_STATE },
    prescriptions: { ...DEFAULT_RESOURCE_STATE },
    lab: { ...DEFAULT_RESOURCE_STATE },
    pharmacy: { ...DEFAULT_RESOURCE_STATE },
    inpatient: { ...DEFAULT_RESOURCE_STATE }
  });

  const [patients, setPatients] = useState(initialData.patientDirectory);
  const [primaryPatient] = useState(initialData.primaryPatient);
  const [queue, setQueue] = useState(initialData.queue);
  const [clinicalTimeline, setClinicalTimeline] = useState(initialData.clinicalTimeline);
  const [prescriptions, setPrescriptions] = useState(initialData.prescriptions);
  const [labReports, setLabReports] = useState(initialData.recentLabReportsList);
  const [inventory, setInventory] = useState(initialData.pharmacyMedicineCatalog);
  const [wards, setWards] = useState(initialData.wardBedList);
  const [vitalsLogs, setVitalsLogs] = useState(initialData.vitalsLogs);
  const [staff, setStaff] = useState(initialData.staff);
  const [auditLogs, setAuditLogs] = useState(initialData.auditLogs);
  const [toastMessage, setToastMessage] = useState(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [deviceMode, setDeviceMode] = useState('auto');
  const [backendReferences, setBackendReferences] = useState({
    medicines: [],
    beds: [],
    admissions: [],
    nurses: []
  });

  const isMobileNavOpen = isSidebarOpen;
  const setIsMobileNavOpen = setIsSidebarOpen;

  const setResourceLoading = (resource, loading) => {
    setResourceStates((prev) => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        loading,
      },
    }));
  };

  const setResourceError = (resource, error) => {
    setResourceStates((prev) => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        error,
      },
    }));
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

  const mapPatient = (patient) => ({
    id: `P${patient.id}`,
    backendId: patient.id,
    patientCode: patient.patientCode,
    name: `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
    age: calculateAge(patient.dateOfBirth),
    gender: patient.gender ? `${patient.gender.charAt(0)}${patient.gender.slice(1).toLowerCase()}` : '—',
    phone: patient.phone || '—',
    email: patient.email || '—',
    lastVisit: formatDate(patient.updatedAt || patient.createdAt),
    status: 'Active',
    address: patient.address || '—',
    bloodGroup: patient.bloodGroup || '—',
    dob: formatDate(patient.dateOfBirth),
  });

  const loadPatients = async () => {
    setResourceLoading('patients', true);
    setResourceError('patients', null);
    try {
      const response = await api.get('/patients');
      const mapped = (response?.patients || []).map(mapPatient);
      if (mapped.length > 0) {
        setPatients(mapped);
      } else {
        setPatients([]);
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        setPatients([]);
      } else {
        setResourceError('patients', error.message);
      }
    } finally {
      setResourceLoading('patients', false);
    }
  };

  const loadAppointments = async () => {
    setResourceLoading('appointments', true);
    setResourceError('appointments', null);
    try {
      const response = await api.get('/appointments');
      const mappedAppointments = (response?.appointments || []).map((apt) => {
        const status = String(apt.status || 'SCHEDULED').replace('_', ' ');
        return {
          id: apt.id,
          backendId: apt.id,
          patientBackendId: apt.patientId,
          name: `${apt.patient?.firstName || ''} ${apt.patient?.lastName || ''}`.trim(),
          time: formatTime(apt.appointmentDate),
          type: apt.department?.name || 'General Medicine',
          status: status.charAt(0) + status.slice(1).toLowerCase(),
          statusColor: withStatusColor(apt.status),
          doctorName: apt.doctor?.user?.name || 'Assigned Doctor',
          appointmentDate: apt.appointmentDate,
        };
      });
      setQueue(mappedAppointments);
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        setQueue([]);
      } else {
        setResourceError('appointments', error.message);
      }
    } finally {
      setResourceLoading('appointments', false);
    }
  };

  const loadClinicalRecords = async () => {
    setResourceLoading('clinical', true);
    setResourceError('clinical', null);
    try {
      const response = await api.get('/clinical-records');
      const mapped = (response?.clinicalRecords || []).map((record) => ({
        id: `CR-${record.id}`,
        backendId: record.id,
        patientBackendId: record.patientId,
        patientName: `${record.patient?.firstName || ''} ${record.patient?.lastName || ''}`.trim(),
        date: formatDate(record.createdAt),
        type: 'Consultation',
        title: record.diagnosis || 'Clinical Consultation',
        doctor: record.doctor?.user?.name || 'Doctor',
        notes: record.notes || record.symptoms || '',
      }));
      setClinicalTimeline(mapped);
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        setClinicalTimeline([]);
      } else {
        setResourceError('clinical', error.message);
      }
    } finally {
      setResourceLoading('clinical', false);
    }
  };

  const loadPrescriptions = async () => {
    setResourceLoading('prescriptions', true);
    setResourceError('prescriptions', null);
    try {
      const response = await api.get('/prescriptions');
      const mapped = (response?.prescriptions || []).map((rx) => ({
        id: `RX-${rx.id}`,
        backendId: rx.id,
        patientBackendId: rx.clinicalRecord?.patientId,
        patientName: `${rx.clinicalRecord?.patient?.firstName || ''} ${rx.clinicalRecord?.patient?.lastName || ''}`.trim() || 'Patient',
        doctor: rx.clinicalRecord?.doctor?.user?.name || 'Doctor',
        date: formatDate(rx.prescribedAt),
        status: 'Pending',
        instructions: rx.notes || 'Follow doctor instructions.',
        items: (rx.items || []).map((item) => ({
          id: item.id,
          medicineId: item.medicineId,
          name: item.medicine?.name || 'Medicine',
          quantity: item.quantity || 1,
          dose: item.dosage || '-',
          freq: item.frequency || '-',
          days: item.duration || '-',
        })),
      }));
      setPrescriptions(mapped);
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        setPrescriptions([]);
      } else {
        setResourceError('prescriptions', error.message);
      }
    } finally {
      setResourceLoading('prescriptions', false);
    }
  };

  const loadLaboratory = async () => {
    setResourceLoading('lab', true);
    setResourceError('lab', null);
    try {
      const response = await api.get('/lab/tests');
      const mapped = (response?.labTests || []).map((test) => ({
        id: `LAB-${test.id}`,
        backendId: test.id,
        resultId: test.result?.id || null,
        patientId: `P${test.clinicalRecord?.patientId || ''}`,
        patientName: `${test.clinicalRecord?.patient?.firstName || ''} ${test.clinicalRecord?.patient?.lastName || ''}`.trim() || 'Patient',
        test: test.testName,
        date: formatDate(test.requestedAt),
        status: test.status === 'COMPLETED' ? 'Completed' : 'Pending',
        statusColor: withStatusColor(test.status),
        remarks: test.result?.remarks || '',
        metrics: test.result?.result
          ? [{ test: test.testName, result: test.result.result, unit: 'value', normal: 'As per report' }]
          : [],
      }));
      setLabReports(mapped);
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        setLabReports([]);
      } else {
        setResourceError('lab', error.message);
      }
    } finally {
      setResourceLoading('lab', false);
    }
  };

  const rebuildWardState = (beds, admissions, patientsList) => {
    const patientById = new Map(patientsList.map((patient) => [patient.backendId, patient]));
    const activeAdmissions = new Map(
      admissions
        .filter((admission) => admission.status === 'ADMITTED')
        .map((admission) => [admission.bedId, admission])
    );

    const wardBedList = beds.map((bed) => {
      const activeAdmission = activeAdmissions.get(bed.id);
      const linkedPatient = activeAdmission ? patientById.get(activeAdmission.patientId) : null;
      return {
        bedNo: bed.bedNumber,
        backendBedId: bed.id,
        wardId: bed.wardId,
        wardName: bed.ward?.name || 'Ward',
        patient: linkedPatient?.name || '—',
        patientId: linkedPatient?.id || null,
        ageGender: linkedPatient ? `${linkedPatient.age} / ${linkedPatient.gender?.charAt(0) || '-'}` : '—',
        condition: activeAdmission ? 'Under Observation' : 'Available',
        status: bed.status === 'OCCUPIED' ? 'Occupied' : 'Available',
        admissionId: activeAdmission?.id || null,
      };
    });

    const totalBeds = wardBedList.length;
    const occupied = wardBedList.filter((bed) => bed.status === 'Occupied').length;
    const available = Math.max(0, totalBeds - occupied);

    setWards(wardBedList);
    setBackendReferences((prev) => ({
      ...prev,
      beds,
      admissions,
    }));

    return {
      totalBeds,
      occupied,
      available,
      occupancyRate: totalBeds > 0 ? Math.round((occupied / totalBeds) * 100) : 0,
    };
  };

  const [wardStats, setWardStats] = useState(initialData.wardStats);

  const loadInpatient = async () => {
    setResourceLoading('inpatient', true);
    setResourceError('inpatient', null);
    try {
      const [bedsResponse, admissionsResponse, vitalsResponse, nursesResponse] = await Promise.all([
        api.get('/beds').catch((error) => {
          if (error instanceof ApiError && error.status === 403) return { beds: [] };
          throw error;
        }),
        api.get('/admissions').catch((error) => {
          if (error instanceof ApiError && error.status === 403) return { admissions: [] };
          throw error;
        }),
        api.get('/vitals').catch((error) => {
          if (error instanceof ApiError && error.status === 403) return { vitals: [] };
          throw error;
        }),
        api.get('/nurses').catch((error) => {
          if (error instanceof ApiError && error.status === 403) return { nurses: [] };
          throw error;
        }),
      ]);

      const beds = bedsResponse?.beds || [];
      const admissions = admissionsResponse?.admissions || [];
      const stats = rebuildWardState(beds, admissions, patients);
      setWardStats(stats);

      const mappedVitals = (vitalsResponse?.vitals || []).map((entry) => ({
        id: `VIT-${entry.id}`,
        backendId: entry.id,
        bedId: entry.patientId ? `P${entry.patientId}` : '—',
        patientName: `${entry.patient?.firstName || ''} ${entry.patient?.lastName || ''}`.trim() || 'Patient',
        timestamp: formatDate(entry.recordedAt),
        temperature: entry.temperature ?? '—',
        bp: entry.bloodPressure || '—',
        pulse: entry.heartRate ?? '—',
        notes: 'Vitals captured from backend',
      }));
      setVitalsLogs(mappedVitals);

      const nurseStaff = (nursesResponse?.nurses || []).map((nurse) => ({
        id: `N-${nurse.id}`,
        name: nurse.user?.name || 'Nurse',
        role: 'Nurse',
        dept: nurse.department?.name || 'Nursing',
        email: nurse.user?.email || '—',
        phone: nurse.user?.phone || '—',
        status: nurse.user?.isActive ? 'Active' : 'Inactive',
      }));

      if (nurseStaff.length > 0) {
        setStaff((prev) => {
          const others = prev.filter((member) => member.role !== 'Nurse');
          return [...nurseStaff, ...others];
        });
      }

      setBackendReferences((prev) => ({
        ...prev,
        nurses: nursesResponse?.nurses || [],
      }));
    } catch (error) {
      setResourceError('inpatient', error.message);
    } finally {
      setResourceLoading('inpatient', false);
    }
  };

  const loadPharmacy = async () => {
    setResourceLoading('pharmacy', true);
    setResourceError('pharmacy', null);
    try {
      const [medicineResponse, inventoryResponse] = await Promise.all([
        api.get('/medicines').catch(() => ({ medicines: [] })),
        api.get('/inventory').catch(() => ({ inventory: [] })),
      ]);

      const medicines = medicineResponse?.medicines || [];
      const inventoryRows = inventoryResponse?.inventory || [];

      setBackendReferences((prev) => ({ ...prev, medicines }));

      const mappedInventory = inventoryRows.map((row) => {
        const medicine = row.medicine || medicines.find((item) => item.id === row.medicineId);
        const status = row.quantity <= row.reorderLevel ? 'Low Stock' : 'In Stock';
        return {
          id: row.id,
          medicineId: row.medicineId,
          name: medicine?.name || 'Medicine',
          category: medicine?.genericName || medicine?.unit || 'General',
          batch: `BATCH-${row.medicineId}`,
          expiry: 'N/A',
          stock: row.quantity,
          status,
        };
      });

      setInventory(mappedInventory);
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        setInventory([]);
      } else {
        setResourceError('pharmacy', error.message);
      }
    } finally {
      setResourceLoading('pharmacy', false);
    }
  };

  const loadCoreData = async () => {
    await Promise.all([
      loadPatients(),
      loadAppointments(),
      loadClinicalRecords(),
      loadPrescriptions(),
      loadLaboratory(),
      loadPharmacy(),
    ]);
    await loadInpatient();
  };

  const setAuthSession = (token, user) => {
    authStorage.setToken(token);
    authStorage.setUser(user);
    setCurrentUser(user);
    const nextRole = ROLE_LABELS[user.role] || user.role;
    setCurrentRole(nextRole);
    setIsAuthenticated(true);
    setActiveTab('Dashboard');
    setViewMode('workspace');
  };

  useEffect(() => {
    const bootstrapSession = async () => {
      const token = authStorage.getToken();
      const user = authStorage.getUser();

      if (!token || !user) {
        setAuthLoading(false);
        return;
      }

      setCurrentUser(user);
      setCurrentRole(ROLE_LABELS[user.role] || user.role);
      setIsAuthenticated(true);

      try {
        await api.get('/auth/me');
        await loadCoreData();
      } catch {
        authStorage.clear();
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    bootstrapSession();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setCurrentRole('Doctor');
      showToast({ type: 'error', message: 'Session expired. Please log in again.' });
    };

    window.addEventListener('jeevanta:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('jeevanta:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      setAuthLoading(true);
      const response = await api.post('/auth/login', {
        email: String(email || '').trim().toLowerCase(),
        password,
      });
      setAuthSession(response.token, response.user);
      await loadCoreData();
      showToast(`Signed into ${ROLE_LABELS[response.user.role] || response.user.role} workspace`, 'success');
      return { success: true };
    } catch (error) {
      showToast({ type: 'error', message: error.message || 'Login failed' });
      return { success: false, message: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    authStorage.clear();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentRole('Doctor');
    setActiveTab('Dashboard');
    showToast('Signed out of workspace', 'info');
  };

  const hasPermission = (permission) => {
    if (!currentRole || !permission) return false;
    const permissions = initialData.rolePermissions?.[currentRole] || [];
    if (Array.isArray(permission)) {
      return permission.some((entry) => permissions.includes(entry));
    }
    return permissions.includes(permission);
  };

  const isAuthorizedTab = (tab) => {
    const allowed = initialData.roleAuthorizedTabs?.[currentRole] || [];
    return allowed.includes(tab);
  };

  const authorizedTabs = useMemo(() => initialData.roleAuthorizedTabs?.[currentRole] || ['Dashboard'], [currentRole]);

  const switchRole = () => {
    showToast({ type: 'info', message: 'Role is assigned by the backend account and cannot be switched from the client.' });
  };

  const registerPatient = async (patientData) => {
    try {
      const normalized = parseName(patientData.name || patientData.fullName);
      const patientCode = `PID-${Date.now()}`;
      const payload = {
        patientCode,
        firstName: normalized.firstName,
        lastName: normalized.lastName,
        phone: patientData.phone,
        email: patientData.email,
        address: patientData.address,
        bloodGroup: patientData.bloodGroup,
        gender: patientData.gender ? String(patientData.gender).toUpperCase() : undefined,
        dateOfBirth: patientData.dob || undefined,
      };

      await api.post('/patients', payload);
      await loadPatients();
      showToast(`Patient registered successfully (${patientCode})`, 'success');
      return patientCode;
    } catch (error) {
      showToast({ type: 'error', message: error.message || 'Unable to register patient' });
      throw error;
    }
  };

  const advanceQueueToken = (tokenNumber, targetStage) => {
    setQueue((prev) => prev.map((item) => {
      if (item.id === tokenNumber || item.token === tokenNumber) {
        const updatedStatus = targetStage === 'completed' ? 'Completed' : targetStage === 'in_consultation' ? 'In Consultation' : 'Waiting';
        return {
          ...item,
          status: updatedStatus,
          statusColor: withStatusColor(updatedStatus.toUpperCase().replace(' ', '_')),
        };
      }
      return item;
    }));
  };

  const saveConsultation = async ({ patientId, chiefComplaint, diagnosis, notes, requestedLabTests = [] }) => {
    try {
      const selectedPatient = patients.find((item) => item.id === patientId || item.patientCode === patientId);
      if (!selectedPatient?.backendId) {
        throw new Error('Patient not found');
      }

      if (!currentUser?.doctorId) {
        throw new Error('Only doctor accounts with linked doctor profile can save consultation');
      }

      const clinicalResponse = await api.post('/clinical-records', {
        patientId: selectedPatient.backendId,
        doctorId: currentUser.doctorId,
        symptoms: chiefComplaint,
        diagnosis,
        notes,
      });

      if (Array.isArray(requestedLabTests) && requestedLabTests.length > 0) {
        await Promise.all(requestedLabTests.map((testName) => api.post('/lab/tests', {
          clinicalRecordId: clinicalResponse.clinicalRecord.id,
          testName,
        })));
      }

      await Promise.all([loadClinicalRecords(), loadLaboratory()]);
      showToast('Consultation saved and synced with backend', 'success');
    } catch (error) {
      showToast({ type: 'error', message: error.message || 'Unable to save consultation' });
      throw error;
    }
  };

  const createPrescription = async ({ patientId, patientName, items = [], instructions }) => {
    try {
      if (!currentUser?.doctorId) {
        throw new Error('Only doctor accounts can create prescriptions');
      }

      const selectedPatient = patients.find((item) => item.id === patientId || item.name === patientName);
      if (!selectedPatient?.backendId) {
        throw new Error('Patient not found');
      }

      let latestClinicalRecord = clinicalTimeline.find((record) => record.patientBackendId === selectedPatient.backendId);
      if (!latestClinicalRecord) {
        const clinicalResponse = await api.post('/clinical-records', {
          patientId: selectedPatient.backendId,
          doctorId: currentUser.doctorId,
          diagnosis: 'Follow-up',
          notes: instructions || 'Auto-created clinical record for prescription',
        });
        latestClinicalRecord = {
          backendId: clinicalResponse.clinicalRecord.id,
          patientBackendId: selectedPatient.backendId,
        };
      }

      const mappedItems = items
        .map((item) => {
          const medicine = backendReferences.medicines.find((entry) =>
            entry.name.toLowerCase().includes(String(item.name || '').toLowerCase()) ||
            String(item.name || '').toLowerCase().includes(entry.name.toLowerCase())
          );
          if (!medicine) return null;
          return {
            medicineId: medicine.id,
            dosage: item.dose,
            frequency: item.freq,
            duration: item.days,
            quantity: Number(item.quantity || 1),
          };
        })
        .filter(Boolean);

      if (mappedItems.length === 0) {
        throw new Error('No matching medicines found in backend inventory');
      }

      await api.post('/prescriptions', {
        clinicalRecordId: latestClinicalRecord.backendId,
        notes: instructions,
        items: mappedItems,
      });

      await loadPrescriptions();
      showToast('Prescription created and sent to pharmacy', 'success');
    } catch (error) {
      showToast({ type: 'error', message: error.message || 'Unable to create prescription' });
      throw error;
    }
  };

  const dispensePrescription = async (prescriptionId) => {
    try {
      const selectedPrescription = prescriptions.find((item) => item.id === prescriptionId || item.backendId === prescriptionId);
      if (!selectedPrescription) {
        throw new Error('Prescription not found');
      }

      if (!selectedPrescription.patientBackendId) {
        throw new Error('Prescription is missing patient mapping');
      }

      const entries = selectedPrescription.items || [];
      if (entries.length === 0) {
        throw new Error('Prescription has no items to dispense');
      }

      await Promise.all(entries.map((entry) => api.post('/dispensations', {
        medicineId: entry.medicineId,
        patientId: selectedPrescription.patientBackendId,
        quantity: Number(entry.quantity || 1),
      })));

      await loadPharmacy();
      showToast(`Prescription ${selectedPrescription.id} dispensed successfully`, 'success');
    } catch (error) {
      showToast({ type: 'error', message: error.message || 'Unable to dispense prescription' });
      throw error;
    }
  };

  const uploadLabReport = async (testId, resultValue, remarks) => {
    try {
      const selectedReport = labReports.find((report) => report.id === testId || report.backendId === testId);
      if (!selectedReport?.backendId) {
        throw new Error('Lab test not found');
      }

      if (selectedReport.resultId) {
        await api.put(`/lab/results/${selectedReport.resultId}`, {
          result: resultValue,
          remarks,
        });
      } else {
        await api.post('/lab/results', {
          labTestId: selectedReport.backendId,
          result: resultValue,
          remarks,
        });
      }

      await loadLaboratory();
      showToast('Lab report uploaded successfully', 'success');
    } catch (error) {
      showToast({ type: 'error', message: error.message || 'Unable to upload lab report' });
      throw error;
    }
  };

  const admitPatientToBed = async (wardId, bedId, patientName, patientId) => {
    try {
      const selectedPatient = patients.find((patient) => patient.id === patientId || patient.name === patientName);
      if (!selectedPatient?.backendId) {
        throw new Error('Patient not found');
      }

      const assignedDoctorId = currentUser?.doctorId || 1;
      await api.post('/admissions', {
        patientId: selectedPatient.backendId,
        doctorId: assignedDoctorId,
        bedId,
      });

      await loadInpatient();
      showToast(`Patient ${selectedPatient.name} admitted successfully`, 'success');
    } catch (error) {
      showToast({ type: 'error', message: error.message || 'Unable to admit patient' });
      throw error;
    }
  };

  const dischargePatientFromBed = async (_wardId, bedId) => {
    try {
      const activeAdmission = backendReferences.admissions.find((entry) => entry.bedId === bedId && entry.status === 'ADMITTED');
      if (!activeAdmission) {
        throw new Error('Active admission not found for this bed');
      }

      await api.patch(`/admissions/${activeAdmission.id}/discharge`, {});
      await loadInpatient();
      showToast('Patient discharged and bed released', 'success');
    } catch (error) {
      showToast({ type: 'error', message: error.message || 'Unable to discharge patient' });
      throw error;
    }
  };

  const recordVitals = async ({ patientName, temperature, bp, pulse, notes }) => {
    try {
      const selectedPatient = patients.find((patient) => patient.name === patientName || patient.id === patientName);
      if (!selectedPatient?.backendId) {
        throw new Error('Patient not found');
      }

      await api.post('/vitals', {
        patientId: selectedPatient.backendId,
        nurseId: currentUser?.nurseId || null,
        temperature,
        bloodPressure: bp,
        heartRate: pulse,
        remarks: notes,
      });

      await loadInpatient();
      showToast('Vitals recorded successfully', 'success');
    } catch (error) {
      showToast({ type: 'error', message: error.message || 'Unable to record vitals' });
      throw error;
    }
  };

  const addStaffMember = (staffData) => {
    const newStaff = {
      id: staffData.employeeId || staffData.id || `STF-${(staff.length + 1).toString().padStart(2, '0')}`,
      name: staffData.name,
      role: staffData.role,
      dept: staffData.dept || 'Hospital Administration',
      email: staffData.email,
      phone: staffData.phone || '—',
      status: 'Active',
    };
    setStaff((prev) => [newStaff, ...prev]);

    setAuditLogs((prev) => [{
      logId: Date.now(),
      user: currentUser?.email || 'admin@jeevanta.gov',
      role: currentRole,
      action: `ADMIN_REGISTER_STAFF: ${newStaff.id} (${newStaff.name} - ${newStaff.role})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    }, ...prev]);

    showToast(`Staff member ${newStaff.name} (${newStaff.role}) registered successfully!`);
    return newStaff;
  };

  const registerAndLoginPatient = async ({ name, phone, password, email }) => {
    try {
      setAuthLoading(true);
      const response = await api.post('/auth/register/patient', {
        name,
        phone,
        password,
        email: email || `${String(name || 'patient').toLowerCase().replace(/\s+/g, '.')}@example.com`,
      });

      setAuthSession(response.token, response.user);
      await loadCoreData();
      showToast(`Account created! Welcome to your Patient Portal, ${response.user.name}!`, 'success');
      return response.user;
    } catch (error) {
      showToast({ type: 'error', message: error.message || 'Unable to register patient' });
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const toggleStaffStatus = (staffId) => {
    setStaff((prev) => prev.map((entry) => {
      if (entry.id === staffId) {
        const nextStatus = entry.status === 'Active' ? 'Inactive' : 'Active';
        showToast(`Staff ${entry.name} is now ${nextStatus}`);
        return { ...entry, status: nextStatus };
      }
      return entry;
    }));
  };

  const retryResource = async (resource) => {
    if (resource === 'patients') return loadPatients();
    if (resource === 'appointments') return loadAppointments();
    if (resource === 'clinical') return loadClinicalRecords();
    if (resource === 'prescriptions') return loadPrescriptions();
    if (resource === 'lab') return loadLaboratory();
    if (resource === 'pharmacy') return loadPharmacy();
    if (resource === 'inpatient') return loadInpatient();
    return null;
  };

  return (
    <HospitalContext.Provider value={{
      isAuthenticated,
      authLoading,
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
      wardStats,
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
      isMobileNavOpen,
      setIsMobileNavOpen,
      resourceStates,
      retryResource,
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
      registerAndLoginPatient,
      refreshAllData: loadCoreData,
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
