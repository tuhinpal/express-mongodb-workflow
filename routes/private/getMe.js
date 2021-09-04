const { ObjectId } = require("bson");
const database = require("../../db");

module.exports = async (req, res) => {
  try {
    var { conn, db } = await database();
    const { id } = req.user; // we get the user id from the token payload it is verified by the middleware

    const user = await db.collection("users").findOne({ _id: ObjectId(id) });
    if (user) {
      delete user.password;
      res.status(200).json({
        status: true,
        message: "Profile fetched successfully",
        data: user,
      });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong",
      reason: error.toString(),
    });
  } finally {
    if (conn) {
      // important to close the connection
      await conn.close();
    }
  }
};
