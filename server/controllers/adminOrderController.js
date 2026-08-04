const Order = require("../models/Order");

// =======================
// Format Order For Admin
// =======================
// Two different phone numbers can matter here and they are not always the
// same person:
//   - customerPhone  -> the account holder's own phone (User.phone, falls
//                        back to shippingAddress.phone if the account has
//                        none on file)
//   - recipientPhone -> the phone number on the shipping address itself,
//                        i.e. whoever is actually meant to receive the
//                        parcel. This is optional — orders placed before
//                        a phone field existed, or guest-style checkouts,
//                        may not have one.
const formatOrder = (order) => ({
  _id: order._id,
  orderId: order._id,

  customerName: order.user?.name || order.shippingAddress?.name || "Unknown",
  customerEmail: order.user?.email || order.shippingAddress?.email || "",
  customerPhone: order.user?.phone || order.shippingAddress?.phone || "",

  recipientPhone: order.shippingAddress?.phone || "",

  address: order.shippingAddress,

  payment: order.paymentMethod,
  status: order.orderStatus,
  total: order.totalPrice,

  items: (order.orderItems || []).map((item) => ({
    productId: item.product?._id || item.product,
    name: item.name,
    brand: item.product?.brand || "AVERNUS",
    image: item.image,
    qty: item.qty,
    price: item.price,
    selectedSize: item.selectedSize,
  })),

  createdAt: order.createdAt,
});

// =======================
// Get All Orders
// =======================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("orderItems.product", "name brand price image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders: orders.map(formatOrder),
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Confirm Order
// =======================
const approveOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "name email phone")
      .populate("orderItems.product", "name brand price image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = "Confirmed";
    order.confirmedAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed successfully",
      order: formatOrder(order),
    });
  } catch (error) {
    console.error("Approve Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Cancel Order
// =======================
const rejectOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "name email phone")
      .populate("orderItems.product", "name brand price image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = "Cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: formatOrder(order),
    });
  } catch (error) {
    console.error("Reject Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllOrders,
  approveOrder,
  rejectOrder,
};