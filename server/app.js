const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// ==========================
// LOAD ENVIRONMENT VARIABLES
// ==========================

dotenv.config();

// ==========================
// ENVIRONMENT CHECK
// ==========================

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

// ==========================
// ROUTE IMPORTS
// ==========================

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const heroSectionRoutes = require("./routes/heroSectionRoutes");

// ==========================
// CREATE EXPRESS APP
// ==========================

const app = express();

// ==========================
// CORE MIDDLEWARE
// ==========================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================
// SERVE OLD LOCAL UPLOADED
// PRODUCT IMAGES
// ==========================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ==========================
// API ROUTES
// ==========================

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/admin", adminRoutes);

// ==========================
// HERO SECTION ROUTES
// Cloudflare R2 + MongoDB
// ==========================

app.use(
  "/api/hero-sections",
  heroSectionRoutes
);

// ==========================
// HEALTH CHECK
// ==========================

app.get("/", (req, res) => {
  res.send("API is running");
});

// ==========================
// TEMPORARY IMAGE TEST
// ==========================

app.get("/test-image", (req, res) => {
  const fs = require("fs");

  const imagePath = path.join(
    __dirname,
    "uploads",
    "products",
    "aventus (1).jpg"
  );

  console.log("Testing image:", imagePath);

  console.log(
    "Image exists:",
    fs.existsSync(imagePath)
  );

  res.json({
    imagePath,
    exists: fs.existsSync(imagePath),
  });
});

// ==========================
// 404 HANDLER
// Must come after all routes
// ==========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==========================
// CENTRAL ERROR HANDLER
// ==========================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ==========================
// SERVER PORT
// ==========================

const PORT = process.env.PORT || 5000;

// ==========================
// CHECK MONGODB URI
// ==========================

if (!process.env.MONGO_URI) {
  console.error(
    "❌ MONGO_URI is missing from .env"
  );

  process.exit(1);
}

// ==========================
// CONNECT TO MONGODB
// ==========================

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {
    console.log("MongoDB Connected");

    console.log(
      "MongoDB Host:",
      mongoose.connection.host
    );

    console.log(
      "MongoDB Database:",
      mongoose.connection.name
    );

    // ==========================
    // START SERVER
    // ==========================

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  })

  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error
    );

    process.exit(1);
  });

module.exports = app;