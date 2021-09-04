const database = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    var { conn, db } = await database();

    var checkIfExists = await db.collection("users").findOne({
      email: req.body.email,
    }); // check if user already exists

    if (checkIfExists) {
      res.status(409).send({
        status: false,
        message: "Already exists, please sign in !",
        reason: "User already exists",
      });
    } else {
      // create user
      var createUser = await db.collection("users").insertOne({
        ...req.body, //already sanitized
        password: bcrypt.hashSync(req.body.password, 10), // hashing is important
        updatedAt: new Date(),
        createdAt: new Date(),
      });

      if (createUser.acknowledged) {
        // sign jwt
        var token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            email: req.body.email,
            id: createUser.insertedId,
          },
          process.env.JWT_SECRET
        );

        res.status(201).send({
          status: true,
          message: "User created successfully",
          token,
        });
      } else {
        throw new Error("Error creating user");
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong",
      reason: error.toString(),
    });
  } finally {
    if (conn) {
      await conn.close();
    }
  }
};
