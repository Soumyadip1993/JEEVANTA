const express = require("express");

const {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
} = require("../controllers/prescriptionController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR"),
  createPrescription
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "PHARMACIST"),
  getPrescriptions
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "PHARMACIST"),
  getPrescriptionById
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR"),
  updatePrescription
);

module.exports = router;
