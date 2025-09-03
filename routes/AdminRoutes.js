const express = require("express");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const isAdminUser = require("../middleware/IsAdminMiddleware");

const router = express.Router();

router.get("/welcome", AuthMiddleware, isAdminUser, (req, res) => {
  res.status(200).json({
    message: "Hey Admin! Welcome back",
  });
});

module.exports = router;
