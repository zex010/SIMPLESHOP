const express = require("express");
const router = express.Router();


// =======================
// CONTROLLERS
// =======================

const {
  loginAdmin,
  getAdminProfile,
  registerAdmin,
} = require("../controllers/adminController");


const {
  getAllOrders,
  approveOrder,
  rejectOrder,
} = require("../controllers/adminOrderController");


const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/adminProductController");


const {
  getAllCustomers,
} = require("../controllers/adminCustomerController");


const {
  getSettings,
  updateSettings,
} = require("../controllers/adminSettingsController");


const {
  getDashboardStats,
  getAnalytics,
} = require("../controllers/adminAnalyticsController");



// =======================
// CONTROLLER TEST
// =======================

console.log("ADMIN ROUTE CONTROLLER CHECK");

console.log({
  loginAdmin: typeof loginAdmin,
  getAdminProfile: typeof getAdminProfile,
  registerAdmin: typeof registerAdmin,

  getAllOrders: typeof getAllOrders,
  approveOrder: typeof approveOrder,
  rejectOrder: typeof rejectOrder,

  getAllProducts: typeof getAllProducts,
  createProduct: typeof createProduct,
  updateProduct: typeof updateProduct,
  deleteProduct: typeof deleteProduct,

  getAllCustomers: typeof getAllCustomers,

  getSettings: typeof getSettings,
  updateSettings: typeof updateSettings,

  getDashboardStats: typeof getDashboardStats,
  getAnalytics: typeof getAnalytics,
});




// =======================
// MIDDLEWARE
// =======================

const adminAuth = require("../middleware/adminAuth");

const upload = require("../middleware/upload");




// =======================
// AUTH
// =======================

router.post(
  "/login",
  loginAdmin
);


router.post(
  "/register",
  registerAdmin
);


router.get(
  "/profile",
  adminAuth,
  getAdminProfile
);




// =======================
// DASHBOARD
// =======================

router.get(
  "/dashboard-stats",
  adminAuth,
  getDashboardStats
);


router.get(
  "/analytics",
  adminAuth,
  getAnalytics
);




// =======================
// ORDERS
// =======================

router.get(
  "/orders",
  adminAuth,
  getAllOrders
);


router.patch(
  "/orders/:id/approve",
  adminAuth,
  approveOrder
);


router.patch(
  "/orders/:id/reject",
  adminAuth,
  rejectOrder
);




// =======================
// PRODUCTS
// =======================


router.get(
  "/products",
  adminAuth,
  getAllProducts
);



router.post(
  "/products",
  adminAuth,
  upload.array("images", 3),
  createProduct
);



router.put(
  "/products/:id",
  adminAuth,
  upload.array("images", 3),
  updateProduct
);



router.delete(
  "/products/:id",
  adminAuth,
  deleteProduct
);




// =======================
// CUSTOMERS
// =======================

router.get(
  "/customers",
  adminAuth,
  getAllCustomers
);




// =======================
// SETTINGS
// =======================

router.get(
  "/settings",
  adminAuth,
  getSettings
);


router.put(
  "/settings",
  adminAuth,
  updateSettings
);




// =======================
// EXPORT ROUTER
// =======================

module.exports = router;