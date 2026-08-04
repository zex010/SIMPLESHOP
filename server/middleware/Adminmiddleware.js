// Must run AFTER the `protect` middleware, since it relies on req.user
// being set by the auth middleware from the JWT.

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Admin privileges required.",
  });
};

module.exports = admin;