const database = require("../../db");

module.exports = async (req, res) => {
  try {
    var { conn, db } = await database();
    const { id } = req.user; // we get the user id from the token payload it is verified by the middleware

    // check if same Title exists
    var checkIfSameTitleExists = await db.collection("posts").findOne({
      userId: id,
      title: req.body.title,
    });

    if (checkIfSameTitleExists) {
      res.status(409).json({
        status: false,
        message: "Same title exists",
        reason: "You already have a post with the same title",
      });
    } else {
      var create = await db.collection("posts").insertOne({
        // we create a new post
        ...req.body, // already sanitized by middleware
        userId: id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (create.acknowledged) {
        res.status(201).json({
          status: true,
          message: "Post created",
          data: {
            postId: create.insertedId,
            postContent: req.body,
          },
        });
      } else {
        throw new Error("Post not created");
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
      // important to close the connection
      await conn.close();
    }
  }
};
