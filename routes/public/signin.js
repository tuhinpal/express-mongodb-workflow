const database = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    var { conn, db } = await database();

    var findUser = await db.collection("users").findOne({
      email: req.body.email,
    }); // check if user already exists

    if (findUser) {
      var password = bcrypt.compareSync(req.body.password, findUser.password);
      if (password) {
        // sign jwt
        var token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            email: findUser.email,
            id: findUser._id,
          },
          process.env.JWT_SECRET
        );

        res.status(200).json({
          status: true,
          message: "User logged in successfully",
          token,
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Wrong password",
          reason: "Wrong password provided",
        });
      }
    } else {
      res.status(404).json({
        status: false,
        message: "Not found, Please sign up !",
        reason: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong",
      reason: error.toString(),
    });
  } finally {
    if (conn) {
      // closing connection is important
      await conn.close();
    }
  }
};
