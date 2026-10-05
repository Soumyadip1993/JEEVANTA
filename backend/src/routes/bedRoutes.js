const express = require('express');

const { createBed, getBeds, getBedById, updateBed } = require('../controllers/bedController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('ADMIN'), createBed);
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'), getBeds);
router.get('/:id', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'), getBedById);
router.patch('/:id', authenticateToken, authorizeRoles('ADMIN'), updateBed);

module.exports = router;
