// Matches your actual models:
// Order: { totalPrice, orderStatus, createdAt, user }
// Product: no timestamps field
// User: { createdAt } (timestamps: true)

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Orders counted as real, confirmed sales for revenue purposes.
const FULFILLED_STATUSES = ["Approved", "Processing", "Delivered"];

// =======================
// Dashboard Summary (top cards)
// =======================
const getDashboardStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [orders, pendingOrders, todaysOrders, productsCount, customersCount] =
      await Promise.all([
        Order.find(),
        Order.countDocuments({ orderStatus: "Pending" }),
        Order.countDocuments({ createdAt: { $gte: startOfDay } }),
        Product.countDocuments(),
        User.countDocuments(),
      ]);

    const revenue = orders
      .filter((o) => FULFILLED_STATUSES.includes(o.orderStatus))
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    res.status(200).json({
      success: true,
      stats: {
        revenue,
        pendingOrders,
        todaysOrders,
        productsCount,
        customersCount,
      },
    });
  } catch (error) {
    console.log("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Analytics (revenue trend, totals)
// =======================
const getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find();
    const fulfilled = orders.filter((o) =>
      FULFILLED_STATUSES.includes(o.orderStatus)
    );

    const revenue = fulfilled.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const sales = fulfilled.length;
    const totalOrders = orders.length;

    const now = new Date();
    const monthly = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const value = fulfilled
        .filter(
          (o) =>
            new Date(o.createdAt) >= date && new Date(o.createdAt) < nextDate
        )
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      monthly.push({ label: monthLabels[date.getMonth()], value });
    }

    res.status(200).json({
      success: true,
      analytics: {
        revenue,
        sales,
        orders: totalOrders,
        monthly,
      },
    });
  } catch (error) {
    console.log("Analytics Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getAnalytics,
};
