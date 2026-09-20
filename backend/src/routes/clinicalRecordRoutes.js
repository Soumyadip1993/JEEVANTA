const express = require("express");

const {
  createClinicalRecord,
  getClinicalRecords,
  getClinicalRecordById,
  updateClinicalRecord,
} = require("../controllers/clinicalRecordController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR"),
  createClinicalRecord
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "NURSE"),
  getClinicalRecords
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "NURSE"),
  getClinicalRecordById
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR"),
  updateClinicalRecord
);

module.exports = router;
