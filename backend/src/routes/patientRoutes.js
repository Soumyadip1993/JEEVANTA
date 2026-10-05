const express = require("express");

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "RECEPTIONIST"),
  createPatient,
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE", "PATIENT"),
  getPatients,
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE", "PATIENT"),
  getPatientById,
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "RECEPTIONIST"),
  updatePatient,
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  deletePatient,
);

module.exports = router;
