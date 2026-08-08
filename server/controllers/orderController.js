// // server/controllers/orderController.js
// // Ensure path is correct relative to the controllers directory
// const Order = require("../models/Order");

// // =======================
// // Create New Order
// // =======================
// // @route   POST /api/orders
// // @access  Private (Requires authentication)
// const createOrder = async (req, res) => {
//   try {
//     const { orderItems, shippingAddress, totalPrice, paymentMethod } = req.body;

//     if (!orderItems || orderItems.length === 0) {
//       return res.status(400).json({ success: false, message: "No order items" });
//     }

//     // req.user._id is populated by the authMiddleware (protect)
//     const order = new Order({
//       user: req.user._id,
//       orderItems,
//       shippingAddress,
//       totalPrice,
//       paymentMethod,
//     });

//     const createdOrder = await order.save();

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order: createdOrder,
//     });
//   } catch (error) {
//     console.error("Create Order Controller Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // =======================
// // Get Logged-in User's Orders
// // =======================
// // @route   GET /api/orders/my
// // @access  Private (Requires authentication)
// const getMyOrders = async (req, res) => {
//   try {
//     // req.user._id is populated by the authMiddleware (protect)
//     const orders = await Order.find({ user: req.user._id })
//       .sort({ createdAt: -1 }); // Sort by newest first

//     res.status(200).json({
//       success: true,
//       orders,
//     });
//   } catch (error) {
//     console.error("Get My Orders Controller Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // =======================
// // Cancel My Own Order (Customer)
// // =======================
// // @route   PATCH /api/orders/:id/cancel
// // @access  Private (order owner only)
// const cancelMyOrder = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Scope the lookup to req.user._id so a customer can only ever
//     // cancel their own order, never someone else's by guessing an id.
//     const order = await Order.findOne({ _id: id, user: req.user._id });

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // Only allow cancellation while the order hasn't shipped yet.
//     if (!["Pending", "Confirmed"].includes(order.orderStatus)) {
//       return res.status(400).json({
//         success: false,
//         message: `This order is already "${order.orderStatus}" and can no longer be cancelled.`,
//       });
//     }

//     order.orderStatus = "Cancelled";

//     const updatedOrder = await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order cancelled successfully",
//       order: updatedOrder,
//     });
//   } catch (error) {
//     console.error("Cancel My Order Controller Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // =======================
// // Get All Orders (Admin)
// // =======================
// // @route   GET /api/orders
// // @access  Private/Admin
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user", "name email")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       orders,
//     });
//   } catch (error) {
//     console.error("Get All Orders Controller Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // =======================
// // Confirm Order (Admin)
// // =======================
// // @route   PUT /api/orders/:id/confirm
// // @access  Private/Admin
// const confirmOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // Matches the enum in models/Order.js:
//     // ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"]
//     order.orderStatus = "Confirmed";
//     order.confirmedAt = new Date();

//     const updatedOrder = await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order confirmed successfully",
//       order: updatedOrder,
//     });
//   } catch (error) {
//     console.error("Confirm Order Controller Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // =======================
// // Cancel Order (Admin)
// // =======================
// // @route   PUT /api/orders/:id/cancel
// // @access  Private/Admin
// const cancelOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     order.orderStatus = "Cancelled";

//     const updatedOrder = await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order cancelled successfully",
//       order: updatedOrder,
//     });
//   } catch (error) {
//     console.error("Cancel Order Controller Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // =======================
// // Mark Order As Shipped (Admin)
// // =======================
// // @route   PUT /api/orders/:id/ship
// // @access  Private/Admin
// const shipOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     order.orderStatus = "Shipped";
//     order.shippedAt = new Date();

//     const updatedOrder = await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order marked as shipped",
//       order: updatedOrder,
//     });
//   } catch (error) {
//     console.error("Ship Order Controller Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // =======================
// // Mark Order As Delivered (Admin)
// // =======================
// // @route   PUT /api/orders/:id/deliver
// // @access  Private/Admin
// const deliverOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     order.orderStatus = "Delivered";
//     order.deliveredAt = new Date();

//     const updatedOrder = await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order marked as delivered",
//       order: updatedOrder,
//     });
//   } catch (error) {
//     console.error("Deliver Order Controller Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = {
//   createOrder,
//   getMyOrders,
//   cancelMyOrder,
//   getAllOrders,
//   confirmOrder,
//   cancelOrder,
//   shipOrder,
//   deliverOrder,
// };


// server/controllers/orderController.js

const Order = require("../models/Order");

// =====================================================
// CREATE NEW ORDER
// POST /api/orders
// Private
// =====================================================
const createOrder = async (req, res) => {
  try {
    console.log("========== CREATE ORDER ==========");
    console.log("Authenticated User:", req.user);
    console.log("Order Body:", req.body);

    const {
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod,
    } = req.body;

    // Make sure authentication actually provided a user
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required.",
      });
    }

    // Validate order items
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items.",
      });
    }

    // Validate shipping address
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required.",
      });
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod,
    });

    const createdOrder = await order.save();

    console.log("Order Saved Successfully:", createdOrder);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Create Order Controller Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET LOGGED-IN USER'S ORDERS
// GET /api/orders/my
// Private
// =====================================================
const getMyOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required.",
      });
    }

    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Controller Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// CANCEL MY OWN ORDER
// PATCH /api/orders/:id/cancel
// Private
// =====================================================
const cancelMyOrder = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required.",
      });
    }

    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (!["Pending", "Confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `This order is already "${order.orderStatus}" and can no longer be cancelled.`,
      });
    }

    order.orderStatus = "Cancelled";

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Cancel My Order Controller Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET ALL ORDERS
// GET /api/orders
// Admin
// =====================================================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Controller Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// CONFIRM ORDER
// PUT /api/orders/:id/confirm
// Admin
// =====================================================
const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.orderStatus = "Confirmed";
    order.confirmedAt = new Date();

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Confirm Order Controller Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// CANCEL ORDER - ADMIN
// PUT /api/orders/:id/cancel
// Admin
// =====================================================
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.orderStatus = "Cancelled";

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Cancel Order Controller Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// MARK ORDER AS SHIPPED
// PUT /api/orders/:id/ship
// Admin
// =====================================================
const shipOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.orderStatus = "Shipped";
    order.shippedAt = new Date();

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order marked as shipped.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Ship Order Controller Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// MARK ORDER AS DELIVERED
// PUT /api/orders/:id/deliver
// Admin
// =====================================================
const deliverOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.orderStatus = "Delivered";
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order marked as delivered.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Deliver Order Controller Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================
module.exports = {
  createOrder,
  getMyOrders,
  cancelMyOrder,
  getAllOrders,
  confirmOrder,
  cancelOrder,
  shipOrder,
  deliverOrder,
};

