const express = require("express");
const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/AuthController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const router = express.Router();

/// All routes are realted to authentication & authoization
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/update-password", AuthMiddleware, changePassword);

module.exports = router;
