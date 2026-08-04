const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: "AVERNUS",
    },
    shippingCharges: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    paymentMethods: {
      cod: { type: Boolean, default: true },
      card: { type: Boolean, default: true },
      wallet: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
