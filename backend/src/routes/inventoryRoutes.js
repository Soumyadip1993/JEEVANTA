const express = require("express");

const {
  createInventory,
  getInventory,
  getInventoryByMedicineId,
  updateInventory,
} = require("../controllers/inventoryController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create inventory
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "PHARMACIST"),
  createInventory
);

// Get all inventory
router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "PHARMACIST"),
  getInventory
);

// Get inventory for a specific medicine
router.get(
  "/medicine/:medicineId",
  authenticateToken,
  authorizeRoles("ADMIN", "PHARMACIST"),
  getInventoryByMedicineId
);

// Update inventory
router.put(
  "/medicine/:medicineId",
  authenticateToken,
  authorizeRoles("ADMIN", "PHARMACIST"),
  updateInventory
);

module.exports = router;
