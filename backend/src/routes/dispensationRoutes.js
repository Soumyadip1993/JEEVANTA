const express = require("express");

const {
  createDispensation,
  getDispensations,
  getDispensationsByPatient,
} = require("../controllers/dispensationController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Dispense medicine
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "PHARMACIST"),
  createDispensation
);

// Get all dispensations
router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "PHARMACIST"),
  getDispensations
);

// Get dispensations for a patient
router.get(
  "/patient/:patientId",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "PHARMACIST"),
  getDispensationsByPatient
);

module.exports = router;
