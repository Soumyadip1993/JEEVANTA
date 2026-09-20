const express = require("express");

const {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
} = require("../controllers/medicineController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create medicine
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "PHARMACIST"),
  createMedicine
);

// Get all medicines
router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "PHARMACIST"),
  getMedicines
);

// Get medicine by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "DOCTOR", "PHARMACIST"),
  getMedicineById
);

// Update medicine
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "PHARMACIST"),
  updateMedicine
);

module.exports = router;
