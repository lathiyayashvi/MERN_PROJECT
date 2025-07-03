const jwt = require('jsonwebtoken');
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // ✅ Look for Bearer token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // extract token

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Optional: fetch user if needed
      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (err) {
      console.log("Token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  res.status(401).json({ message: "Not authorized, token missing" });
};

module.exports = { protect };
