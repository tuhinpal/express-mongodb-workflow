const database = require("../../db");

module.exports = async (req, res) => {
  try {
    var { conn, db } = await database();

    var findSchema = {};
    var sortSchema = {};
    var limit = 24;
    var skip = 0;

    if (req.query.limit && !isNaN(Number(req.query.limit))) {
      // calculate limit
      limit = Number(req.query.limit);
    }

    if (req.query.page && !isNaN(req.query.page)) {
      // calculate skip
      skip = (Number(req.query.page) - 1) * limit;
    }

    if (req.query.category) {
      // find by category
      if (req.query.category.includes(",")) {
        findSchema["category"] = { $in: req.query.category.split(",") };
      } else {
        findSchema["category"] = { $in: [req.query.category] };
      }
    }

    if (req.query.tags) {
      // find by tags
      if (req.query.tags.includes(",")) {
        findSchema["tags"] = { $in: req.query.tags.split(",") };
      } else {
        findSchema["tags"] = { $in: [req.query.tags] };
      }
    }

    if (req.query.searchQuery) {
      // find by searchQuery
      findSchema["$text"] = { $search: req.query.searchQuery };
    } else {
      // sort by date
      if (req.query.sortByDate === "old") {
        sortSchema["createdAt"] = 1;
      } else {
        sortSchema["createdAt"] = -1;
      }
    }

    var getPosts = await db
      .collection("posts")
      .find({ ...findSchema, isPrivate: false })
      .sort(sortSchema)
      .limit(limit)
      .skip(skip)
      .project({
        _id: 1,
        title: 1,
        content: 1,
        images: 1,
        category: 1,
        tags: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .toArray();

    var totalCount = await db
      .collection("posts")
      .countDocuments({ ...findSchema, isPrivate: false }); // get total count

    if (totalCount > getPosts.length + skip) {
      // if there are more posts
      var nextPage = {
        has: true,
        pageNo: !isNaN(Number(req.query.page)) ? Number(req.query.page) + 1 : 2,
      };
    } else {
      // if there are no more posts
      var nextPage = {
        has: false,
        pageNo: 0,
      };
    }

    if (skip > 0) {
      // if there are previous posts
      var prevPage = {
        has: true,
        pageNo: !isNaN(Number(req.query.page)) ? Number(req.query.page) - 1 : 1,
      };
    } else {
      // if there are no previous posts
      var prevPage = {
        has: false,
        pageNo: 0,
      };
    }

    res.status(200).json({
      status: true,
      message: "Posts fetched successfully",
      data: {
        totalCount,
        posts: getPosts,
        prevPage,
        nextPage,
      },
    });
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
