const express = require("express");
const { login } = require("../controllers/authController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);

router.get("/me", authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated user",
    user: req.user,
  });
});

router.get(
  "/admin-test",
  authenticateToken,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted",
      user: req.user,
    });
  },
);

module.exports = router;
