// Centralized In-Memory Database for Jeevanta GHMS
// Strictly enforces 3NF relational data structures matching Assignment 6 (LLD) & Assignment 7 (SDD)

export const initialData = {
  // 7 Core Roles
  roles: [
    { id: 'Patient', label: 'Patient', desc: 'Appointments, medical history, prescriptions & lab reports', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'Receptionist', label: 'Receptionist', desc: 'Walk-in registration, token generation, queue triage & bed check', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { id: 'Doctor', label: 'Doctor', desc: 'Split-pane EMR, clinical diagnosis, lab orders & digital prescriptions', badgeColor: 'bg-sky-100 text-sky-800 border-sky-200' },
    { id: 'Nurse', label: 'Nurse', desc: 'Ward bed tracking, vitals recording & inpatient admissions', badgeColor: 'bg-teal-100 text-teal-800 border-teal-200' },
    { id: 'Laboratory Technician', label: 'Lab Technician', desc: 'Diagnostic test requests, result entry & PDF upload fulfillment', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: 'Pharmacist', label: 'Pharmacist', desc: 'Prescription dispensing, atomic stock deduction & low-stock alerts', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 'Administrator', label: 'Administrator', desc: 'System-wide analytics, staff provisioning, audit logs & RBAC governance', badgeColor: 'bg-rose-100 text-rose-800 border-rose-200' }
  ],

  // Universal Dynamic RBAC Permissions Map
  rolePermissions: {
    'Doctor': [
      'view_dashboard',
      'view_opd',
      'conduct_consultation',
      'prescribe_medication',
      'order_lab_tests',
      'view_appointments',
      'view_patients_directory',
      'view_patient_emr',
      'view_lab_reports',
      'review_lab_results',
      'view_inpatient_wards'
    ],
    'Receptionist': [
      'view_dashboard',
      'register_patient',
      'edit_patient_demographics',
      'view_appointments',
      'book_appointment',
      'checkin_patient',
      'issue_queue_token',
      'view_patients_directory',
      'view_inpatient_wards'
    ],
    'Nurse': [
      'view_dashboard',
      'view_inpatient_wards',
      'admit_patient',
      'discharge_patient',
      'record_vitals',
      'view_patients_directory',
      'view_patient_emr'
    ],
    'Laboratory Technician': [
      'view_dashboard',
      'view_lab_workbench',
      'enter_lab_result',
      'upload_lab_report',
      'flag_critical_lab',
      'view_patients_directory'
    ],
    'Pharmacist': [
      'view_dashboard',
      'view_pharmacy_inventory',
      'dispense_prescription',
      'restock_medicine',
      'adjust_stock',
      'view_patients_directory'
    ],
    'Administrator': [
      'view_dashboard',
      'view_executive_reports',
      'export_reports',
      'manage_staff',
      'toggle_staff_status',
      'view_audit_logs',
      'manage_settings',
      'view_inpatient_wards',
      'view_pharmacy_inventory'
    ],
    'Patient': [
      'view_dashboard',
      'view_own_records',
      'view_own_appointments',
      'book_appointment',
      'download_own_lab_reports'
    ]
  },

  // Authorized Application Tabs per Role
  roleAuthorizedTabs: {
    'Doctor': ['Dashboard', 'OPD & Consultation', 'Appointments', 'Patients', 'Laboratory', 'Inpatient / Wards'],
    'Receptionist': ['Dashboard', 'Patients', 'Appointments', 'Inpatient / Wards'],
    'Nurse': ['Dashboard', 'Inpatient / Wards', 'Patients'],
    'Laboratory Technician': ['Dashboard', 'Laboratory', 'Patients'],
    'Pharmacist': ['Dashboard', 'Pharmacy', 'Patients'],
    'Administrator': ['Dashboard', 'Reports', 'Inpatient / Wards', 'Pharmacy', 'Settings'],
    'Patient': ['Dashboard', 'Appointments', 'Patients', 'Laboratory']
  },

  // Role Navigation Mapping (Exact RBAC matching specification)
  roleNav: {
    'Patient': [
      { id: 'Dashboard', label: 'Dashboard' },
      { id: 'Appointments', label: 'Appointments' },
      { id: 'Medical History', label: 'Medical History' },
      { id: 'Prescriptions', label: 'Prescriptions' },
      { id: 'Lab Reports', label: 'Lab Reports' },
      { id: 'Profile', label: 'Profile' }
    ],
    'Receptionist': [
      { id: 'Dashboard', label: 'Dashboard' },
      { id: 'Patients', label: 'Patients (Register)' },
      { id: 'Appointments', label: 'Appointments' },
      { id: 'Queue', label: 'Live Queue' },
      { id: 'Ward / Bed', label: 'Ward / Bed' },
      { id: 'Profile', label: 'Profile' }
    ],
    'Doctor': [
      { id: 'Dashboard', label: 'Clinical Dashboard' },
      { id: 'Patients', label: 'Patients List' },
      { id: 'Appointments', label: 'Daily Schedule' },
      { id: 'EMR / Consultation', label: 'EMR Workspace' },
      { id: 'Prescriptions', label: 'Create Prescription' },
      { id: 'Lab Requests', label: 'Lab Requests' },
      { id: 'Profile', label: 'Profile' }
    ],
    'Nurse': [
      { id: 'Dashboard', label: 'Ward & Vitals' },
      { id: 'Ward', label: 'Ward Overview' },
      { id: 'Patients', label: 'Admitted Patients' },
      { id: 'Vitals', label: 'Record Vitals' },
      { id: 'Admission / Bed', label: 'Admission & Bed' },
      { id: 'Profile', label: 'Profile' }
    ],
    'Laboratory Technician': [
      { id: 'Dashboard', label: 'Lab Workbench' },
      { id: 'Test Requests', label: 'Pending Requests' },
      { id: 'Laboratory Reports', label: 'Report Upload' },
      { id: 'Profile', label: 'Profile' }
    ],
    'Pharmacist': [
      { id: 'Dashboard', label: 'Pharmacy Overview' },
      { id: 'Prescriptions / Dispensing', label: 'Prescriptions / Dispensing' },
      { id: 'Inventory', label: 'Medicine Inventory' },
      { id: 'Profile', label: 'Profile' }
    ],
    'Administrator': [
      { id: 'Dashboard', label: 'Hospital Analytics' },
      { id: 'Staff & Roles', label: 'Staff & Roles' },
      { id: 'Departments', label: 'Departments' },
      { id: 'Reports', label: 'System Reports' },
      { id: 'Users', label: 'User Accounts' },
      { id: 'Profile', label: 'Profile' },
      { id: 'Settings', label: 'Settings' }
    ]
  },

  // Image-aligned exact prototype datasets
  dashboardMetrics: {
    todayPatients: 128,
    todayPatientsGrowth: '+12% from yesterday',
    appointments: 36,
    upcomingAppointments: 8,
    bedOccupancyPercent: 82,
    bedOccupancyRatio: '164 / 200 beds',
    labPending: 14,
    labCriticalCount: 5
  },

  hospitalMetrics: {
    todayPatients: 128,
    todayPatientsGrowth: '+12% from yesterday',
    appointments: 36,
    upcomingAppointments: 8,
    bedOccupancyRate: '82%',
    bedOccupancyPercent: 82,
    bedOccupancyRatio: '164 / 200 beds',
    bedsOccupied: 164,
    totalBeds: 200,
    labReportsPending: 14,
    labReportsCritical: 2,
    labPending: 14,
    labCriticalCount: 2
  },

  todayAppointmentsList: [
    { id: 1, name: 'Ramesh Kumar', time: '09:00 AM', type: 'General Medicine', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 2, name: 'Sunita Devi', time: '09:30 AM', type: 'Follow-up', status: 'In Consultation', statusColor: 'bg-sky-50 text-sky-700 border-sky-200' },
    { id: 3, name: 'Arjun Mehta', time: '10:00 AM', type: 'Pediatrics', status: 'Waiting', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 4, name: 'Farah Khan', time: '10:30 AM', type: 'Gynecology', status: 'Scheduled', statusColor: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 5, name: 'Mohan Lal', time: '11:00 AM', type: 'General Medicine', status: 'Scheduled', statusColor: 'bg-blue-50 text-blue-700 border-blue-200' }
  ],

  todayAppointments: [
    { id: 1, name: 'Ramesh Kumar', time: '09:00 AM', type: 'General Medicine', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 2, name: 'Sunita Devi', time: '09:30 AM', type: 'Follow-up', status: 'In Consultation', statusColor: 'bg-sky-50 text-sky-700 border-sky-200' },
    { id: 3, name: 'Arjun Mehta', time: '10:00 AM', type: 'Pediatrics', status: 'Waiting', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 4, name: 'Farah Khan', time: '10:30 AM', type: 'Gynecology', status: 'Scheduled', statusColor: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 5, name: 'Mohan Lal', time: '11:00 AM', type: 'General Medicine', status: 'Scheduled', statusColor: 'bg-blue-50 text-blue-700 border-blue-200' }
  ],

  recentLabReportsList: [
    { id: 'LR-01', patient: 'Priya Sharma', test: 'CBC', date: '10 Nov 2026', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'LR-02', patient: 'Vikram Singh', test: 'Blood Sugar', date: '10 Nov 2026', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'LR-03', patient: 'Neha Patel', test: 'Thyroid Profile', date: '10 Nov 2026', status: 'Processing', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'LR-04', patient: 'Suresh Rao', test: 'Lipid Profile', date: '09 Nov 2026', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'LR-05', patient: 'Meena Kumari', test: 'Urine Analysis', date: '09 Nov 2026', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  ],

  importantAlerts: [
    { id: 1, type: 'pharmacy', text: '5 medicines in low stock', sub: 'Pharmacy • 10 Nov 2026' },
    { id: 2, type: 'opd', text: '12 patients waiting for more than 30 mins', sub: 'OPD • 10 Nov 2026' },
    { id: 3, type: 'lab', text: '2 lab reports marked critical', sub: 'Laboratory • 10 Nov 2026' },
    { id: 4, type: 'ward', text: 'Bed occupancy is at 82%', sub: 'Wards • 10 Nov 2026' }
  ],

  patientDirectory: [
    { id: 'P1001', name: 'Ramesh Kumar', age: 45, gender: 'Male', phone: '9876543210', lastVisit: '10 Nov 2026', status: 'Active', address: '123, Gandhi Nagar, Bengaluru, Karnataka', email: 'ramesh@example.com', dob: '12 Mar 1981 (45 years)', aadhaar: '1234 5678 9012' },
    { id: 'P1002', name: 'Sunita Devi', age: 32, gender: 'Female', phone: '9876543211', lastVisit: '10 Nov 2026', status: 'Active', address: '45, Indiranagar, Bengaluru', email: 'sunita@example.com', dob: '15 Aug 1994 (32 years)', aadhaar: '2345 6789 0123' },
    { id: 'P1003', name: 'Arjun Mehta', age: 8, gender: 'Male', phone: '9876543212', lastVisit: '09 Nov 2026', status: 'Active', address: '78, Koramangala, Bengaluru', email: 'arjun.parents@example.com', dob: '20 Jul 2018 (8 years)', aadhaar: '3456 7890 1234' },
    { id: 'P1004', name: 'Farah Khan', age: 29, gender: 'Female', phone: '9876543213', lastVisit: '09 Nov 2026', status: 'Active', address: '12, HSR Layout, Bengaluru', email: 'farah@example.com', dob: '05 Jan 1997 (29 years)', aadhaar: '4567 8901 2345' },
    { id: 'P1005', name: 'Mohan Lal', age: 60, gender: 'Male', phone: '9876543214', lastVisit: '08 Nov 2026', status: 'Inactive', address: '89, Malleshwaram, Bengaluru', email: 'mohan@example.com', dob: '10 Oct 1966 (60 years)', aadhaar: '5678 9012 3456' },
    { id: 'P1006', name: 'Priya Sharma', age: 27, gender: 'Female', phone: '9876543215', lastVisit: '08 Nov 2026', status: 'Active', address: '34, Whitefield, Bengaluru', email: 'priya@example.com', dob: '14 Feb 1999 (27 years)', aadhaar: '6789 0123 4567' }
  ],

  cbcReportData: {
    patientName: 'Ramesh Kumar',
    patientId: 'P1001',
    ageGender: 'Male • 45 years • 9876543210',
    sampleId: 'LAB2026111005',
    collectionDate: '09 Nov 2026',
    testName: 'Complete Blood Count (CBC)',
    rows: [
      { test: 'Hemoglobin', result: '13.8 g/dL', reference: '13.0 - 17.0', status: 'Normal' },
      { test: 'Total Leukocyte Count', result: '7,600 /µL', reference: '4,000 - 11,000', status: 'Normal' },
      { test: 'Platelet Count', result: '2.4 lakh/µL', reference: '1.5 - 4.5', status: 'Normal' },
      { test: 'RBC Count', result: '4.8 million/µL', reference: '4.5 - 5.9', status: 'Normal' },
      { test: 'Hematocrit', result: '42 %', reference: '40 - 50', status: 'Normal' }
    ]
  },

  pharmacyMedicineCatalog: [
    { name: 'Paracetamol 500mg', category: 'Analgesic', batch: 'PAR2026A', expiry: '12/2027', stock: 450, status: 'In Stock' },
    { name: 'Amoxicillin 500mg', category: 'Antibiotic', batch: 'AMX2026B', expiry: '08/2026', stock: 25, status: 'Low Stock' },
    { name: 'Metformin 500mg', category: 'Antidiabetic', batch: 'MET2026C', expiry: '05/2027', stock: 320, status: 'In Stock' },
    { name: 'Amlodipine 5mg', category: 'Antihypertensive', batch: 'AML2026D', expiry: '11/2026', stock: 18, status: 'Low Stock' },
    { name: 'Atorvastatin 10mg', category: 'Lipid Control', batch: 'ATOR2026E', expiry: '04/2027', stock: 210, status: 'In Stock' }
  ],

  wardBedList: [
    { bedNo: 'G-01', patient: 'Ramesh Kumar', ageGender: '45 / M', condition: 'Stable', status: 'Admitted', ward: 'General Ward' },
    { bedNo: 'G-02', patient: 'Sunita Devi', ageGender: '32 / F', condition: 'Post-op', status: 'Admitted', ward: 'General Ward' },
    { bedNo: 'G-03', patient: 'Arjun Mehta', ageGender: '28 / M', condition: 'Observation', status: 'Admitted', ward: 'General Ward' },
    { bedNo: 'G-04', patient: 'Farah Khan', ageGender: '35 / F', condition: 'Stable', status: 'Admitted', ward: 'General Ward' },
    { bedNo: 'G-05', patient: 'Mohan Lal', ageGender: '60 / M', condition: 'Critical', status: 'Admitted', ward: 'General Ward' }
  ],

  wardStats: {
    totalBeds: 50,
    occupied: 41,
    available: 9,
    occupancyRate: 82
  },

  // Primary sample patient as per document
  primaryPatient: {
    id: 'PID-PL00123',
    name: 'Astha Sharma',
    dob: '2006-06-10',
    age: 20,
    gender: 'Female',
    bloodGroup: 'B+',
    phone: '9876543210',
    address: '12, MG Road, Kolkata',
    allergies: 'None reported',
    upcomingAppointment: {
      date: '15 Sep 2026',
      time: '10:30 AM',
      doctor: 'Dr. Amit Sharma',
      department: 'General Medicine',
      status: 'Confirmed'
    }
  },

  patientsList: [
    { id: 'PID-PL00123', name: 'Astha Sharma', age: 20, gender: 'Female', phone: '9876543210', department: 'General Medicine', status: 'Waiting' },
    { id: 'PID-PL00124', name: 'Ramesh Patel', age: 48, gender: 'Male', phone: '9876543211', department: 'General Medicine', status: 'Completed' },
    { id: 'PID-PL00125', name: 'Anita Sharma', age: 34, gender: 'Female', phone: '9876543212', department: 'General Medicine', status: 'In Consultation' },
    { id: 'PID-PL00126', name: 'Vikas Kumar', age: 29, gender: 'Male', phone: '9876543213', department: 'Cardiology', status: 'Waiting' },
    { id: 'PID-PL00127', name: 'Neha Das', age: 24, gender: 'Female', phone: '9876543214', department: 'General Medicine', status: 'Waiting' },
    { id: 'PID-PL00128', name: 'Sanjay Roy', age: 52, gender: 'Male', phone: '9876543215', department: 'General Medicine', status: 'Waiting' }
  ],

  // Queue tokens
  queue: [
    { token: 'GM-001', patient: 'Ramesh Patel', patientId: 'PID-PL00124', time: '09:30', status: 'Completed', stage: 'completed' },
    { token: 'GM-002', patient: 'Anita Sharma', patientId: 'PID-PL00125', time: '09:45', status: 'In consultation', stage: 'in_consultation' },
    { token: 'GM-003', patient: 'Astha Sharma', patientId: 'PID-PL00123', time: '10:00', status: 'Waiting', stage: 'waiting' },
    { token: 'GM-004', patient: 'Neha Das', patientId: 'PID-PL00127', time: '10:15', status: 'Waiting', stage: 'waiting' },
    { token: 'GM-005', patient: 'Sanjay Roy', patientId: 'PID-PL00128', time: '10:30', status: 'Waiting', stage: 'waiting' }
  ],

  // Clinical timeline for Astha Sharma
  clinicalTimeline: [
    { id: 'CR-101', date: '15 May 2026', type: 'Consultation', title: 'Acute viral fever', doctor: 'Dr. Amit Sharma', notes: 'Rest advised. Plenty of fluids.' },
    { id: 'CR-102', date: '10 May 2026', type: 'Lab report', title: 'CBC completed', doctor: 'Dr. Amit Sharma', notes: 'All values within reference range.' },
    { id: 'CR-103', date: '01 May 2026', type: 'Prescription', title: '3 medicines prescribed', doctor: 'Dr. Amit Sharma', notes: 'Paracetamol, Cetirizine, Pantoprazole.' },
    { id: 'CR-104', date: '12 Apr 2026', type: 'Consultation', title: 'Follow-up visit', doctor: 'Dr. Amit Sharma', notes: 'Patient recovered well.' }
  ],

  // Active Prescriptions
  prescriptions: [
    {
      id: 'RX-2026-0142',
      patientId: 'PID-PL00123',
      patientName: 'Astha Sharma',
      doctor: 'Dr. Amit Sharma',
      department: 'General Medicine',
      date: '05 Sep 2026',
      status: 'Dispensed',
      instructions: 'Take medicines after food unless otherwise instructed.',
      items: [
        { medicineId: 'MED-01', name: 'Paracetamol 650mg', dose: '1 tablet', frequency: 'Twice daily', duration: '5 days', quantity: 10 },
        { medicineId: 'MED-02', name: 'Cetirizine 10mg', dose: '1 tablet', frequency: 'Once daily', duration: '5 days', quantity: 5 },
        { medicineId: 'MED-03', name: 'Pantoprazole 40mg', dose: '1 tablet', frequency: 'Once daily', duration: '5 days', quantity: 5 }
      ]
    },
    {
      id: 'RX-2026-0143',
      patientId: 'PID-PL00125',
      patientName: 'Anita Sharma',
      doctor: 'Dr. Amit Sharma',
      department: 'General Medicine',
      date: '15 Sep 2026',
      status: 'Pending',
      instructions: 'Complete antibiotic course without skipping.',
      items: [
        { medicineId: 'MED-04', name: 'Amoxicillin 500mg', dose: '1 capsule', frequency: 'Thrice daily', duration: '5 days', quantity: 15 },
        { medicineId: 'MED-01', name: 'Paracetamol 650mg', dose: '1 tablet', frequency: 'SOS', duration: '3 days', quantity: 6 }
      ]
    }
  ],

  // Diagnostic Lab Reports
  labReports: [
    {
      id: 'LAB-2026-201',
      patientId: 'PID-PL00123',
      patientName: 'Astha Sharma',
      test: 'CBC',
      requestedBy: 'Dr. Amit Sharma',
      requestDate: '10 May 2026',
      status: 'Completed',
      metrics: [
        { test: 'Hemoglobin', result: '13.2', unit: 'g/dL', normal: '12.0 - 15.5' },
        { test: 'WBC', result: '7,200', unit: 'cells/µL', normal: '4,000 - 11,000' },
        { test: 'RBC', result: '4.6', unit: 'million/µL', normal: '4.2 - 5.4' },
        { test: 'Platelets', result: '2,30,000', unit: '/µL', normal: '1,50,000 - 4,50,000' }
      ],
      remarks: 'All hematological parameters within healthy biological reference intervals.',
      filePath: 'Finalized_Report_CBC_PID-PL00123.pdf'
    },
    {
      id: 'LAB-2026-202',
      patientId: 'PID-PL00123',
      patientName: 'Astha Sharma',
      test: 'Lipid Profile',
      requestedBy: 'Dr. Amit Sharma',
      requestDate: '01 May 2026',
      status: 'Completed',
      metrics: [
        { test: 'Total Cholesterol', result: '178', unit: 'mg/dL', normal: '< 200' },
        { test: 'HDL Cholesterol', result: '54', unit: 'mg/dL', normal: '> 50' },
        { test: 'LDL Cholesterol', result: '98', unit: 'mg/dL', normal: '< 100' },
        { test: 'Triglycerides', result: '126', unit: 'mg/dL', normal: '< 150' }
      ],
      remarks: 'Lipid levels normal. Continue balanced dietary guidelines.',
      filePath: 'Finalized_Report_Lipid_PID-PL00123.pdf'
    },
    {
      id: 'LAB-2026-203',
      patientId: 'PID-PL00123',
      patientName: 'Astha Sharma',
      test: 'Blood Sugar',
      requestedBy: 'Dr. Amit Sharma',
      requestDate: '20 Apr 2026',
      status: 'Completed',
      metrics: [
        { test: 'Fasting Blood Glucose', result: '92', unit: 'mg/dL', normal: '70 - 99' },
        { test: 'Post-Prandial (2hr)', result: '124', unit: 'mg/dL', normal: '< 140' }
      ],
      remarks: 'Euglycemic profile.',
      filePath: 'Finalized_Report_Glucose_PID-PL00123.pdf'
    },
    {
      id: 'LAB-REQ-204',
      patientId: 'PID-PL00123',
      patientName: 'Astha Sharma',
      test: 'Urine Routine',
      requestedBy: 'Dr. Amit Sharma',
      requestDate: '15 Sep 2026',
      status: 'Pending',
      metrics: [],
      remarks: 'Awaiting specimen analysis from pathology bench.',
      filePath: null
    }
  ],

  // Pharmacy Inventory
  inventory: [
    { id: 'MED-01', name: 'Paracetamol 650mg', category: 'Tablet', stock: 45, min: 20, unitPrice: 2.50, status: 'Healthy' },
    { id: 'MED-02', name: 'Cetirizine 10mg', category: 'Tablet', stock: 25, min: 20, unitPrice: 4.00, status: 'Healthy' },
    { id: 'MED-03', name: 'Pantoprazole 40mg', category: 'Tablet', stock: 120, min: 30, unitPrice: 7.50, status: 'Healthy' },
    { id: 'MED-04', name: 'Amoxicillin 500mg', category: 'Capsule', stock: 8, min: 15, unitPrice: 9.00, status: 'Low Stock' },
    { id: 'MED-05', name: 'ORS Sachet', category: 'Sachet', stock: 240, min: 100, unitPrice: 15.00, status: 'Healthy' },
    { id: 'MED-06', name: 'Azithromycin 500mg', category: 'Tablet', stock: 14, min: 25, unitPrice: 18.00, status: 'Low Stock' },
    { id: 'MED-07', name: 'Metformin 500mg', category: 'Tablet', stock: 95, min: 30, unitPrice: 3.20, status: 'Healthy' }
  ],

  // Ward and Inpatient Bed Allocation
  wards: [
    {
      wardId: 'WARD-A',
      name: 'General Ward A',
      totalBeds: 20,
      occupied: 14,
      available: 6,
      beds: [
        { bedId: 'Bed A-101', patientName: 'Ramesh Patel', patientId: 'PID-PL00124', status: 'Occupied', admissionDate: '06 Sep 2026', diagnosis: 'Acute Bronchitis' },
        { bedId: 'Bed A-102', patientName: 'Anita Sharma', patientId: 'PID-PL00125', status: 'Occupied', admissionDate: '08 Sep 2026', diagnosis: 'Gastroenteritis' },
        { bedId: 'Bed A-103', patientName: null, patientId: null, status: 'Free', admissionDate: null, diagnosis: null },
        { bedId: 'Bed A-104', patientName: 'Vikas Kumar', patientId: 'PID-PL00126', status: 'Occupied', admissionDate: '10 Sep 2026', diagnosis: 'Observation' },
        { bedId: 'Bed A-105', patientName: null, patientId: null, status: 'Free', admissionDate: null, diagnosis: null },
        { bedId: 'Bed A-106', patientName: 'Neha Das', patientId: 'PID-PL00127', status: 'Occupied', admissionDate: '11 Sep 2026', diagnosis: 'Viral Pyrexia' },
        { bedId: 'Bed A-107', patientName: 'Sanjay Roy', patientId: 'PID-PL00128', status: 'Occupied', admissionDate: '12 Sep 2026', diagnosis: 'Hypertension Crisis' },
        { bedId: 'Bed A-108', patientName: null, patientId: null, status: 'Free', admissionDate: null, diagnosis: null },
        { bedId: 'Bed G-12', patientName: 'Astha Sharma', patientId: 'PID-PL00123', status: 'Occupied', admissionDate: '06 Sep 2026', diagnosis: 'General Observation' },
        { bedId: 'Bed G-13', patientName: null, patientId: null, status: 'Free', admissionDate: null, diagnosis: null }
      ]
    },
    {
      wardId: 'WARD-B',
      name: 'Observation Ward',
      totalBeds: 20,
      occupied: 14,
      available: 6,
      beds: [
        { bedId: 'Bed B-201', patientName: 'Arjun Singh', patientId: 'PID-PL00130', status: 'Occupied', admissionDate: '13 Sep 2026', diagnosis: 'Post-OP Observation' },
        { bedId: 'Bed B-202', patientName: null, patientId: null, status: 'Free', admissionDate: null, diagnosis: null }
      ]
    }
  ],

  // Physiological Vitals Record
  vitalsLogs: [
    { id: 'VIT-001', bedId: 'Bed A-101', patientName: 'Ramesh Patel', timestamp: '14 Sep 2026 • 08:00 AM', temperature: 98.6, bp: '120/80', pulse: 72, notes: 'Patient comfortable and stable.' },
    { id: 'VIT-002', bedId: 'Bed G-12', patientName: 'Astha Sharma', timestamp: '14 Sep 2026 • 09:30 AM', temperature: 98.4, bp: '118/78', pulse: 70, notes: 'Afebrile, vitals normal.' }
  ],

  // Staff and User Management
  staff: [
    { id: 'STF-01', name: 'Dr. Amit Sharma', role: 'Doctor', dept: 'General Medicine', email: 'amit.sharma@jeevanta.gov', phone: '9876500001', status: 'Active' },
    { id: 'STF-02', name: 'Dr. Rahul Kumar', role: 'Doctor', dept: 'Cardiology', email: 'rahul.kumar@jeevanta.gov', phone: '9876500002', status: 'Active' },
    { id: 'STF-03', name: 'Priya Nair', role: 'Nurse', dept: 'Nursing / Ward A', email: 'priya.nair@jeevanta.gov', phone: '9876500003', status: 'Active' },
    { id: 'STF-04', name: 'Reception 01', role: 'Receptionist', dept: 'Front Desk / OPD', email: 'reception01@jeevanta.gov', phone: '9876500004', status: 'Active' },
    { id: 'STF-05', name: 'Rahul Mehta', role: 'Laboratory Technician', dept: 'Pathology & Lab', email: 'rahul.mehta@jeevanta.gov', phone: '9876500005', status: 'Active' },
    { id: 'STF-06', name: 'Kavita Rao', role: 'Pharmacist', dept: 'Central Pharmacy', email: 'kavita.rao@jeevanta.gov', phone: '9876500006', status: 'Active' },
    { id: 'STF-07', name: 'Administrator Name', role: 'Administrator', dept: 'Hospital Administration', email: 'admin@jeevanta.gov', phone: '9876500000', status: 'Active' }
  ],

  // System Audit Logs (FR-10, SDD Algorithm 1)
  auditLogs: [
    { logId: 1001, user: 'admin@jeevanta.gov', role: 'Administrator', action: 'LOGIN_SUCCESS', timestamp: '2026-09-15 08:30:12' },
    { logId: 1002, user: 'reception01@jeevanta.gov', role: 'Receptionist', action: 'REGISTER_PATIENT: PID-PL00123', timestamp: '2026-09-15 08:45:00' },
    { logId: 1003, user: 'amit.sharma@jeevanta.gov', role: 'Doctor', action: 'CREATE_PRESCRIPTION: RX-2026-0142', timestamp: '2026-09-15 09:12:44' },
    { logId: 1004, user: 'kavita.rao@jeevanta.gov', role: 'Pharmacist', action: 'DISPENSE_MEDICINE: RX-2026-0142', timestamp: '2026-09-15 09:40:15' },
    { logId: 1005, user: 'priya.nair@jeevanta.gov', role: 'Nurse', action: 'RECORD_VITALS: Bed A-101', timestamp: '2026-09-15 10:05:00' }
  ]
};
