
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ============================================================
// CREATE JWT
// ============================================================

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// ============================================================
// REGISTER USER
// POST /api/auth/register
// ============================================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      address,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    // Check password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters.",
      });
    }

    // Normalize email
    const normalizedEmail =
      email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phoneNumber: phoneNumber
        ? phoneNumber.trim()
        : "",
      address: address
        ? address.trim()
        : "",
    });

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
      },
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Registration failed. Please try again.",
    });
  }
};

// ============================================================
// LOGIN USER
// POST /api/auth/login
// ============================================================

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // Compare password
    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // Create token
    const token = generateToken(
      user._id
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber:
          user.phoneNumber || "",
        address:
          user.address || "",
      },
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Login failed. Please try again.",
    });
  }
};

// ============================================================
// GET CURRENT USER
// GET /api/auth/me
// GET /api/auth/profile
// ============================================================

const getMe = async (req, res) => {
  try {
    // authMiddleware should attach the user
    // to req.user
    const userId =
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Not authorized.",
      });
    }

    const user =
      await User.findById(userId).select(
        "-password"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "GET ME ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve user profile.",
    });
  }
};

// ============================================================
// UPDATE PROFILE
// PUT /api/auth/profile
// ============================================================

const updateProfile = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Not authorized.",
      });
    }

    const {
      name,
      email,
      phoneNumber,
      address,
      password,
    } = req.body;

    const user =
      await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    // Update basic information
    if (name !== undefined) {
      user.name = name.trim();
    }

    if (email !== undefined) {
      const normalizedEmail =
        email.trim().toLowerCase();

      // Check whether another account
      // already uses this email
      const existingUser =
        await User.findOne({
          email: normalizedEmail,
          _id: {
            $ne: userId,
          },
        });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message:
            "That email is already in use.",
        });
      }

      user.email = normalizedEmail;
    }

    if (phoneNumber !== undefined) {
      user.phoneNumber =
        phoneNumber.trim();
    }

    if (address !== undefined) {
      user.address =
        address.trim();
    }

    // Update password only if supplied
    if (
      password !== undefined &&
      password.trim() !== ""
    ) {
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 8 characters.",
        });
      }

      user.password =
        await bcrypt.hash(
          password,
          10
        );
    }

    await user.save();

    const updatedUser =
      await User.findById(
        userId
      ).select("-password");

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update profile.",
    });
  }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  registerUser,
  loginUser,
  getMe,
};

