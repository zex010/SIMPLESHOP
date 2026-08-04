const Settings = require("../models/Settings");

// =======================
// Get Store Settings
// =======================
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.log("Get Settings Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Update Store Settings
// =======================
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    Object.assign(settings, req.body);
    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.log("Update Settings Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
