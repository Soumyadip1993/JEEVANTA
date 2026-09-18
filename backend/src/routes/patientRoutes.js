const express = require("express");

const {
  createPatient,
  getPatients,
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
  createPatient
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE"),
  getPatients
);

module.exports = router;
