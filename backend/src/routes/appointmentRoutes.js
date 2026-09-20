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
  authorizeRoles("ADMIN", "RECEPTIONIST"),
  createAppointment,
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE"),
  getAppointments,
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE"),
  getAppointmentById,
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "RECEPTIONIST"),
  updateAppointment,
);

router.patch(
  "/:id/cancel",
  authenticateToken,
  authorizeRoles("ADMIN", "RECEPTIONIST"),
  cancelAppointment,
);

module.exports = router;
