const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    // ==========================
    // STORE INFORMATION
    // ==========================

    storeName: {
      type: String,
      default: "AVERNUS",
      trim: true,
    },

    shippingCharges: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "USD",
      trim: true,
    },

    // ==========================
    // PAYMENT METHODS
    // ==========================

    paymentMethods: {
      cod: {
        type: Boolean,
        default: true,
      },

      card: {
        type: Boolean,
        default: true,
      },

      wallet: {
        type: Boolean,
        default: false,
      },
    },

    // ==========================
    // HERO IMAGES
    // Cloudflare R2 public URLs
    // ==========================

    heroImages: {
      men: {
        type: String,
        default: "",
      },

      women: {
        type: String,
        default: "",
      },

      collection: {
        type: String,
        default: "",
      },

      bestSellers: {
        type: String,
        default: "",
      },

      newArrivals: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);