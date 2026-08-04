const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  cancelMyOrder,
  getAllOrders,
  confirmOrder,
  cancelOrder,
  shipOrder,
  deliverOrder,
} = require("../controllers/orderController");

// Midlewares
const protect = require("../middleware/authMiddleware");
// Assuming you have an admin middleware to check req.user.role === 'admin'
const admin = require("../middleware/adminMiddleware");

// USER Routes (Protected)
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.patch("/:id/cancel", protect, cancelMyOrder);

// ADMIN Routes (Protected & Admin only)
router.get("/", protect, admin, getAllOrders);
router.put("/:id/confirm", protect, admin, confirmOrder);
router.put("/:id/cancel", protect, admin, cancelOrder);
router.put("/:id/ship", protect, admin, shipOrder);
router.put("/:id/deliver", protect, admin, deliverOrder);

module.exports = router;