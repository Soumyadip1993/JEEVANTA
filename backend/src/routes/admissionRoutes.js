const express = require("express");

const {
  createAdmission,
  getAdmissions,
  getAdmissionById,
  getAdmissionsByPatient,
  dischargePatient,
} = require("../controllers/admissionController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admit patient and assign bed
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "NURSE"),
  createAdmission
);

// Get all admissions
router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"),
  getAdmissions
);

// Get admission by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"),
  getAdmissionById
);

// Get admissions for a specific patient
router.get(
  "/patient/:patientId",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"),
  getAdmissionsByPatient
);

// Discharge patient and release bed
router.patch(
  "/:id/discharge",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "NURSE"),
  dischargePatient
);

module.exports = router;
