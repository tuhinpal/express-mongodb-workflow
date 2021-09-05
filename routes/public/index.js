const express = require("express");
const router = express.Router();

router.post("/signup", require("../../validation/signup"), require("./signup"));
router.post("/signin", require("../../validation/signin"), require("./signin"));
router.post("/getPosts", require("./getPosts"));

module.exports = router;
