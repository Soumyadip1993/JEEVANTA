const express = require("express");

const {
  createLabTest,
  getLabTests,
  getLabTestById,
  updateLabTestStatus,
  createLabResult,
  updateLabResult,
} = require("../controllers/labController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create lab test
router.post(
  "/tests",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR"),
  createLabTest
);

// Get all lab tests
router.get(
  "/tests",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "LAB_TECHNICIAN"),
  getLabTests
);

// Get lab test by ID
router.get(
  "/tests/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "LAB_TECHNICIAN"),
  getLabTestById
);

// Update lab test status
router.patch(
  "/tests/:id/status",
  authenticateToken,
  authorizeRoles("ADMIN", "LAB_TECHNICIAN"),
  updateLabTestStatus
);

// Create lab result
router.post(
  "/results",
  authenticateToken,
  authorizeRoles("ADMIN", "LAB_TECHNICIAN"),
  createLabResult
);

// Update lab result
router.put(
  "/results/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "LAB_TECHNICIAN"),
  updateLabResult
);

module.exports = router;
