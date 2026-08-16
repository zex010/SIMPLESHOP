const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

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

// Get logged-in user's information
router.get("/profile", protect, getMe);

// Update logged-in user's information
router.put("/profile", protect, updateProfile);


// =====================================
// OPTIONAL ALIAS
// =====================================

// Get current logged-in user
router.get("/me", protect, getMe);


module.exports = router;