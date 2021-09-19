const express = require("express");
const router = express.Router();

router.post("/signup", require("../../validation/signup"), require("./signup"));
router.post("/signin", require("../../validation/signin"), require("./signin"));
router.get("/getPosts", require("./getPosts"));

module.exports = router;
