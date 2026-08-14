const HeroSection = require("../models/HeroSection");
const {
  r2,
  PutObjectCommand,
  BUCKET_NAME,
} = require("../config/r2");

// ==========================
// UPLOAD IMAGE TO R2
// ==========================

const uploadToR2 = async (file) => {
  if (!file) return "";

  const extension =
    file.originalname.split(".").pop()?.toLowerCase() || "jpg";

  const safeName = file.originalname
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase();

  const key = `hero/${Date.now()}-${safeName}.${extension}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
};

// ==========================
// GET ALL HERO SECTIONS
// ==========================

const getHeroSections = async (req, res) => {
  try {
    const sections = await HeroSection.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      sections,
    });
  } catch (error) {
    console.error("Get Hero Sections Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load hero sections",
    });
  }
};

// ==========================
// GET ACTIVE HERO SECTION
// ==========================

const getHeroSection = async (req, res) => {
  try {
    const { sectionKey } = req.params;

    const section = await HeroSection.findOne({
      sectionKey: sectionKey.toLowerCase(),
      isActive: true,
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found",
      });
    }

    res.json({
      success: true,
      section,
    });
  } catch (error) {
    console.error("Get Hero Section Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load hero section",
    });
  }
};

// ==========================
// CREATE HERO SECTION
// ==========================

const createHeroSection = async (req, res) => {
  try {
    const {
      sectionKey,
      title,
      subtitle,
      description,
      isActive,
    } = req.body;

    if (!sectionKey || !title) {
      return res.status(400).json({
        success: false,
        message: "Section key and title are required",
      });
    }

    const normalizedKey = sectionKey.trim().toLowerCase();

    const existing = await HeroSection.findOne({
      sectionKey: normalizedKey,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A hero section with this key already exists",
      });
    }

    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadToR2(req.file);
    }

    const section = await HeroSection.create({
      sectionKey: normalizedKey,
      title: title.trim(),
      subtitle: subtitle?.trim() || "",
      description: description?.trim() || "",
      imageUrl,
      isActive:
        isActive === undefined
          ? true
          : isActive === "true" || isActive === true,
    });

    res.status(201).json({
      success: true,
      message: "Hero section created successfully",
      section,
    });
  } catch (error) {
    console.error("Create Hero Section Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create hero section",
      error: error.message,
    });
  }
};

// ==========================
// UPDATE HERO SECTION
// ==========================

const updateHeroSection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await HeroSection.findById(id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found",
      });
    }

    const {
      sectionKey,
      title,
      subtitle,
      description,
      isActive,
    } = req.body;

    if (sectionKey !== undefined) {
      section.sectionKey = sectionKey.trim().toLowerCase();
    }

    if (title !== undefined) {
      section.title = title.trim();
    }

    if (subtitle !== undefined) {
      section.subtitle = subtitle.trim();
    }

    if (description !== undefined) {
      section.description = description.trim();
    }

    if (isActive !== undefined) {
      section.isActive =
        isActive === "true" || isActive === true;
    }

    // Replace image if a new one was uploaded
    if (req.file) {
      section.imageUrl = await uploadToR2(req.file);
    }

    await section.save();

    res.json({
      success: true,
      message: "Hero section updated successfully",
      section,
    });
  } catch (error) {
    console.error("Update Hero Section Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update hero section",
      error: error.message,
    });
  }
};

// ==========================
// DELETE HERO SECTION
// ==========================

const deleteHeroSection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await HeroSection.findById(id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found",
      });
    }

    await HeroSection.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Hero section deleted successfully",
    });
  } catch (error) {
    console.error("Delete Hero Section Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete hero section",
    });
  }
};

module.exports = {
  getHeroSections,
  getHeroSection,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
};