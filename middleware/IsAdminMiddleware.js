const isAdminUser = async (req, res, next) => {
  /// Get the role passed from the previous middleware -> Auth middleware if it's admin then only show the page
  if (req.role !== "admin") {
    return res.status(401).json({
      message: "Not authorize to access this page! Admin rights required",
    });
  }
  /// go to next
  next();
};

module.exports = isAdminUser;
