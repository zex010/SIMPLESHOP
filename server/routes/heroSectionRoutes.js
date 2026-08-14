const express = require("express");

const {
  getHeroSections,
  getHeroSection,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
} = require("../controllers/heroSectionController");

const upload = require("../middleware/upload");

const router = express.Router();

// ==========================
// GET ALL HERO SECTIONS
// ==========================

router.get("/", getHeroSections);

// ==========================
// GET ONE ACTIVE HERO SECTION
// Example: /api/hero-sections/men
// ==========================

router.get("/:sectionKey", getHeroSection);

// ==========================
// CREATE HERO SECTION
// ==========================

router.post(
  "/",
  upload.single("image"),
  createHeroSection
);

// ==========================
// UPDATE HERO SECTION
// ==========================

router.put(
  "/:id",
  upload.single("image"),
  updateHeroSection
);

// ==========================
// DELETE HERO SECTION
// ==========================

router.delete(
  "/:id",
  deleteHeroSection
);

module.exports = router;