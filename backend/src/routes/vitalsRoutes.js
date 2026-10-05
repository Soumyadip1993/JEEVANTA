const express = require("express");

const {
  createVitals,
  getVitals,
  getVitalsById,
  getVitalsByPatient,
  updateVitals,
} = require("../controllers/vitalsController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create vitals
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "NURSE"),
  createVitals
);

// Get all vitals
router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "NURSE"),
  getVitals
);

// Get vitals by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "NURSE"),
  getVitalsById
);

// Get vitals for a specific patient
router.get(
  "/patient/:patientId",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "NURSE"),
  getVitalsByPatient
);

// Update vitals
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "NURSE"),
  updateVitals
);

module.exports = router;
