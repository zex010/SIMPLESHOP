// Uses your existing User model (../models/User, already used in
// controllers/authController.js) and Order model.
//
// Phone/address: if your User model already stores `phone` / `address`
// fields, those are used directly. If a customer hasn't set a profile
// address (or your User model doesn't have one), we fall back to the
// shippingAddress from their most recent order so the admin panel still
// has something useful to show.

const User = require("../models/User");
const Order = require("../models/Order");

const formatAddress = (address) => {
  if (!address) return "";
  if (typeof address === "string") return address;

  const {
    street,
    address1,
    address2,
    city,
    state,
    zip,
    postalCode,
    country,
  } = address;

  return [street || address1, address2, city, state, zip || postalCode, country]
    .filter(Boolean)
    .join(", ");
};

const getAllCustomers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    // One pass over Orders: count per user AND grab their most recent
    // shippingAddress (sorted newest-first, $first picks the latest).
    const orderAgg = await Order.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$user",
          totalOrders: { $sum: 1 },
          latestShippingAddress: { $first: "$shippingAddress" },
        },
      },
    ]);

    const orderMap = {};
    orderAgg.forEach((entry) => {
      orderMap[String(entry._id)] = entry;
    });

    const customers = users.map((user) => {
      const orderInfo = orderMap[String(user._id)];
      const shipping = orderInfo?.latestShippingAddress || {};

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || shipping.phone || shipping.phoneNumber || "",
        address: formatAddress(user.address) || formatAddress(shipping),
        createdAt: user.createdAt,
        totalOrders: orderInfo?.totalOrders || 0,
      };
    });

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.log("Get Customers Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllCustomers,
};