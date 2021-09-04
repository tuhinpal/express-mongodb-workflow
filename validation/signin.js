var validator = require("validator");

// never trust user input

// body : email, password

module.exports = (req, res, next) => {
    try {
      if (!validator.isEmail(req.body.email)) throw new Error("Invalid email");
      if (!validator.isLength(req.body.password, { min: 6, max: undefined })) throw new Error("Password must be at least 6 characters");  
      next();
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Bad Request",
        reason: error.toString(),
      });
    }
};
