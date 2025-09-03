const jwt = require("jsonwebtoken");

const AuthMiddleware = async (req, res, next) => {
  try {
    console.log("Auth Middleware is called!");
    /// get the token from the req header
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied!, Please login to continue",
      });
    }

    /// validate the token if it's exist or proper
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(payload);

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Access denied!, Please login to continue",
      });
    }

    req.userId = payload.userId;
    req.role = payload.role;
    req.username = payload.username;

    /// If all good move to next
    next();
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token expired, please login again" });
    } else if (e.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid Token" });
    }

    return res.status(401).json({ error: "Token verification failed" });
  }
};

module.exports = AuthMiddleware;
