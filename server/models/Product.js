const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      required: true,
    },

    collection: {
      type: String,
      default: "",
      trim: true,
    },

    // Product Flags
    isNew: {
      type: Boolean,
      default: false,
    },

    isBestseller: {
      type: Boolean,
      default: false,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Description
    description: {
      type: String,
      default: "",
    },

    story: {
      type: String,
      default: "",
    },

    ingredients: {
      type: String,
      default: "",
    },

    // Images
    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    // Fragrance Notes
    fragranceNotes: {
      top: {
        type: [String],
        default: [],
      },

      heart: {
        type: [String],
        default: [],
      },

      base: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);