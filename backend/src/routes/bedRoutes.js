const express = require("express");

const {
  createBed,
  getBeds,
  getBedById,
  updateBed,
} = require("../controllers/bedController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create bed
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  createBed
);

// Get all beds
router.get(
  "/",
  authenticateToken,
  authorizeRoles(
    "ADMIN",
    "DOCTOR",
    "NURSE",
    "RECEPTIONIST"
  ),
  getBeds
);

// Get bed by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(
    "ADMIN",
    "DOCTOR",
    "NURSE",
    "RECEPTIONIST"
  ),
  getBedById
);

// Update bed
router.patch(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  updateBed
);

module.exports = router;
