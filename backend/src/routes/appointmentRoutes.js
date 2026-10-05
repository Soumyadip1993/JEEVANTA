const express = require("express");

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
} = require("../controllers/appointmentController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "RECEPTIONIST", "PATIENT"),
  createAppointment,
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE", "PATIENT"),
  getAppointments,
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE", "PATIENT"),
  getAppointmentById,
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "RECEPTIONIST", "PATIENT"),
  updateAppointment,
);

router.patch(
  "/:id/cancel",
  authenticateToken,
  authorizeRoles("ADMIN", "RECEPTIONIST", "PATIENT"),
  cancelAppointment,
);

module.exports = router;
