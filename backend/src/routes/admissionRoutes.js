const express = require('express');

const { createAdmission, getAdmissions, getAdmissionById, getAdmissionsByPatient, dischargePatient } = require('../controllers/admissionController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'NURSE'), createAdmission);
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT'), getAdmissions);
router.get('/patient/:patientId', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT'), getAdmissionsByPatient);
router.get('/:id', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT'), getAdmissionById);
router.patch('/:id/discharge', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'NURSE'), dischargePatient);

module.exports = router;
