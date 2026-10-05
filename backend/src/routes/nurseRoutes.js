const express = require('express');

const { createNurse, getNurses, getNurseById } = require('../controllers/nurseController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('ADMIN'), createNurse);
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'NURSE'), getNurses);
router.get('/:id', authenticateToken, authorizeRoles('ADMIN', 'NURSE'), getNurseById);

module.exports = router;
