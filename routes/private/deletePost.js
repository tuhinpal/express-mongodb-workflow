const { ObjectId } = require("mongodb");
const database = require("../../db");

module.exports = async (req, res) => {
  try {
    var { conn, db } = await database();
    const { id } = req.user; // we get the user id from the token payload it is verified by the middleware

    // check if post exists
    var checkIfExists = await db.collection("posts").findOne({
      userId: id,
      _id: ObjectId(req.params.postId), // we get the post id from the url,
    });

    if (checkIfExists) {
      var deletePost = await db.collection("posts").deleteOne({
        userId: id,
        _id: ObjectId(req.params.postId),
      });

      if (deletePost.acknowledged) {
        res.status(200).json({
          status: true,
          message: "Post deleted",
          data: {
            postId: req.params.postId,
          },
        });
      } else {
        throw new Error("Post not deleted");
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
