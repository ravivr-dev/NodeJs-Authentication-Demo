const express = require("express");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const router = express.Router();

router.get("/welcome", AuthMiddleware, (req, res) => {
  console.log(req.userId);
  console.log(req.role);
  console.log(req.username);
  res.json({
    message: "Welcome to Home Page!",
  });
});

module.exports = router;
