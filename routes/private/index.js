const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();

function isAuthenticated(req, res, next) {
  try {
    const user = jwt.verify(
      req.headers.authorization || req.query.auth, // accept token from header(authorization) or query(auth)
      process.env.JWT_SECRET
    );
    req.user = user;
    return next();
  } catch (error) {
    // means jwt expired
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
      reason: error.toString(),
    });
  }
}

router.get("/getMe", isAuthenticated, require("./getMe"));

module.exports = router;