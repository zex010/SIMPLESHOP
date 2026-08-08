// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const protect = async (req, res, next) => {
//   try {
//     let token;

//     // Check if Authorization header exists
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];

//       // Verify JWT Token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Find User (without password)
//       req.user = await User.findById(decoded.id).select("-password");

//       next();
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided",
//       });
//     }
//   } catch (error) {
//     console.log(error);

//     return res.status(401).json({
//       success: false,
//       message: "Invalid Token",
//     });
//   }
// };

// module.exports = protect;


const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // =====================================
    // CHECK AUTHORIZATION HEADER
    // =====================================
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login.",
      });
    }

    // =====================================
    // VERIFY JWT
    // =====================================
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("JWT decoded:", decoded);

    // =====================================
    // FIND USER
    // =====================================
    const user = await User.findById(decoded.id).select(
      "-password"
    );

    // IMPORTANT:
    // Token may be valid but the user may no longer exist.
    if (!user) {
      console.log(
        "Authenticated user not found:",
        decoded.id
      );

      return res.status(401).json({
        success: false,
        message: "User no longer exists. Please login again.",
      });
    }

    // =====================================
    // ATTACH USER TO REQUEST
    // =====================================
    req.user = user;

    console.log("Authenticated User:", {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });

    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

module.exports = protect;

