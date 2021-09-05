const validator = require("validator");
const xss = require("xss");


// never trust user input

// body : title, content, isPrivate, tags(array), images(array), category(array)

module.exports = (req, res, next) => {
    try {
        if (req.body.title && !validator.isLength(req.body.title, { min: 2, max: undefined })) throw new Error("Title must be at least 2 characters");
        if (req.body.content && !validator.isLength(req.body.content, { min: 100, max: undefined })) throw new Error("Content must be at least 100 characters");
        if (req.body.isPrivate && typeof req.body.isPrivate !== "boolean") throw new Error("isPrivate must be a boolean");
        if (req.body.tags && !Array.isArray(req.body.tags)) throw new Error("Tags must be an array");
        if (req.body.images && !Array.isArray(req.body.images)) throw new Error("Image must be an array");
        if (req.body.category && !Array.isArray(req.body.category)) throw new Error("Category must be an array");

        if (req.body.tags) {
            for (var i = 0; i < req.body.tags.length; i++) {
                if (typeof req.body.tags[i] !== "string") throw new Error(`Tag item must be a string (Error in tag no ${i})`);
            }
        }

        if (req.body.images) {
            for (var i = 0; i < req.body.images.length; i++) {
                if (typeof req.body.images[i] !== "string") throw new Error(`Image item must be a string (Error in images no ${i})`);
            }
        }

        if (req.body.category) {
            for (var i = 0; i < req.body.category.length; i++) {
                if (typeof req.body.category[i] !== "string") throw new Error(`Category item must be a string (Error in category no ${i})`);
            }
        }

        // html sanitization
        if (req.body.title) req.body.title = xss(req.body.title);
        if (req.body.content) req.body.content = xss(req.body.content);

        var allBodyItemsKeys = Object.keys(req.body) // remove undefined empty items

        for (var i = 0; i < allBodyItemsKeys.length; i++) {
            if (req.body[allBodyItemsKeys[i]] === undefined || req.body[allBodyItemsKeys[i]] === "") delete req.body[allBodyItemsKeys[i]];
        }

        next();
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Bad Request",
            reason: error.toString(),
        });
    }
};
