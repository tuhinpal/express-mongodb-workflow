const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();

function isAuthenticated(req, res, next) {
  /* #swagger.security = [{
               "apiKeyAuth": []
        }] */

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

router.post(
  "/createPost",
  [isAuthenticated, require("../../validation/createPost")],
  require("./createPost")
);

router.post(
  "/updatePost/:postId",
  [isAuthenticated, require("../../validation/updatePost")],
  require("./updatePost")
);

router.delete("/deletePost/:postId", isAuthenticated, require("./deletePost"));

module.exports = router;
