const { ObjectId } = require("mongodb");
const database = require("../../db");

module.exports = async (req, res) => {
  try {
    var { conn, db } = await database();
    const { id } = req.user; // we get the user id from the token payload it is verified by the middleware

    // check if same Title exists
    var checkIfExists = await db.collection("posts").findOne({
      userId: id,
      _id: ObjectId(req.params.postId), // we get the post id from the url,
    });

    if (checkIfExists) {
      var updatePost = await db.collection("posts").updateOne(
        {
          userId: id,
          _id: ObjectId(req.params.postId),
        },
        {
          $set: {
            ...req.body,
            updatedAt: new Date(),
          },
        }
      );

      if (updatePost.acknowledged) {
        res.status(201).json({
          status: true,
          message: "Post updated",
          data: {
            postId: req.params.postId,
            updatedItems: req.body,
          },
        });
      } else {
        throw new Error("Post not updated");
      }
    } else {
      res.status(404).json({
        status: false,
        message: "Post not found",
        reason: "This post is not exists. Please create a post first !",
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
      // important to close the connection
      await conn.close();
    }
  }
};
