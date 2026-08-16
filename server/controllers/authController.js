

const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  getMe,
  updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// =====================================
// TEST ROUTE
// =====================================

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth routes are working",
  });
});

// =====================================
// PUBLIC ROUTES
// =====================================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// =====================================
// PROTECTED ROUTES
// =====================================

// Get logged-in user's profile
router.get("/profile", protect, getProfile);

// Update logged-in user's profile
router.put("/profile", protect, updateProfile);

// Alternative current-user route
router.get("/me", protect, getMe);

// =====================================
// EXPORT
// =====================================

module.exports = router;

