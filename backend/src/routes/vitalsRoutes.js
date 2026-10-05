const express = require('express');

const { createVitals, getVitals, getVitalsById, getVitalsByPatient, updateVitals } = require('../controllers/vitalsController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('ADMIN', 'NURSE'), createVitals);
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'), getVitals);
router.get('/patient/:patientId', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'), getVitalsByPatient);
router.get('/:id', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'), getVitalsById);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN', 'NURSE'), updateVitals);

module.exports = router;
