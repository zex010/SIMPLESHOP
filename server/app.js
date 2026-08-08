// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// console.log("MONGO URI DATABASE:", process.env.MONGO_URI?.split(".net/")[1]);
// const cors = require("cors");
// const path = require("path");

// dotenv.config();

// // Route imports
// const authRoutes = require("./routes/authRoutes");
// const productRoutes = require("./routes/productRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const adminRoutes = require("./routes/adminRoutes");

// const app = express();

// // Core middleware (must come before routes)
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve product images. Files here are reachable at
// // http://192.168.10.6:5000/uploads/<filename> — matches the
// // `product.image` paths used across the frontend (e.g. "/uploads/foo.jpg").
// // Adjust "uploads" below if your images actually live in a different folder.
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Route mounts
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/admin", adminRoutes);

// // Health check
// app.get("/", (req, res) => {
//   res.send("API is running");
// });

// // 404 handler (after all routes)
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: "Route not found" });
// });

// // Central error handler (must have 4 args to be recognized by Express)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || "Server Error",
//   });
// });

// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected");
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error);
//     process.exit(1);
//   });

// module.exports = app;

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

console.log("====================================");
console.log("ENVIRONMENT CHECK");
console.log("====================================");

console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("MONGO_URL exists:", !!process.env.MONGO_URL);

if (process.env.MONGO_URI) {
  console.log(
    "MONGO URI DATABASE:",
    process.env.MONGO_URI.split(".net/")[1]
  );
} else {
  console.log("MONGO URI DATABASE: NOT FOUND");
}

console.log("====================================");

// Route imports
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Create Express app
const app = express();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded product images
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// Server port
const PORT = process.env.PORT || 5000;

// Make sure MongoDB URI exists
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing from .env");
  process.exit(1);
}

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    console.log("MongoDB Host:", mongoose.connection.host);
    console.log("MongoDB Database:", mongoose.connection.name);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

module.exports = app;
