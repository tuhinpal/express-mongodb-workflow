const validator = require("validator");
const xss = require("xss");


// never trust user input

// body : title, content, isPrivate, tags(array), image(array), category(array)

module.exports = (req, res, next) => {
    try {
      if (!validator.isLength(req.body.title, { min: 2, max: undefined })) throw new Error("Title must be at least 2 characters");  
      if (!validator.isLength(req.body.content, { min: 100, max: undefined })) throw new Error("Content must be at least 100 characters");
      if (typeof req.body.isPrivate !=="boolean") throw new Error("isPrivate must be a boolean");
      if (!Array.isArray(req.body.tags)) throw new Error("Tags must be an array");
      if (!Array.isArray(req.body.image)) throw new Error("Image must be an array");
      if (!Array.isArray(req.body.category)) throw new Error("Category must be an array");
      
      for (var i = 0; i < req.body.tags.length; i++) {
        if (typeof req.body.tags[i] !== "string") throw new Error(`Tag item must be a string (Error in tag no ${i})`);
      }
      for (var i = 0; i < req.body.image.length; i++) {
          if (typeof req.body.image[i] !== "string") throw new Error(`Image item must be a string (Error in image no ${i})`);
      }
      for (var i = 0; i < req.body.category.length; i++) {
          if (typeof req.body.category[i] !== "string") throw new Error(`Category item must be a string (Error in category no ${i})`);
      }

      // html sanitization
      req.body.title = xss(req.body.title);
      req.body.content = xss(req.body.content);


      next();
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Bad Request",
        reason: error.toString(),
      });
    }
};
