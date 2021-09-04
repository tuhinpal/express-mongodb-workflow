var validator = require("validator");

// never trust user input

// body : email, password, phone number, name optional: address, city, state, zipcode, country,

module.exports = (req, res, next) => {
    try {
      if (!validator.isEmail(req.body.email)) throw new Error("Invalid email");
      if (!validator.isLength(req.body.password, { min: 6, max: undefined })) throw new Error("Password must be at least 6 characters");
      if (!validator.isMobilePhone(req.body.phone, "any")) throw new Error("Invalid phone number"); 
      if (!validator.isLength(req.body.name, { min: 2, max: undefined })) throw new Error("Name must be at least 2 characters");
      if (req.body.address && !validator.isLength(req.body.address, { min: 2, max: undefined })) throw new Error("Address must be at least 2 characters");
      if (req.body.city && !validator.isLength(req.body.city, { min: 2, max: undefined })) throw new Error("City must be at least 2 characters");
      if (req.body.state && !validator.isLength(req.body.state, { min: 2, max: undefined })) throw new Error("State must be at least 2 characters");
      if (req.body.zipcode && !validator.isLength(req.body.zipcode, { min: 5, max: undefined })) throw new Error("Zipcode must be at least 5 characters");
      if (req.body.country && !validator.isLength(req.body.country, { min: 2, max: undefined })) throw new Error("Country must be at least 2 characters");
      
  
      next();
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Bad Request",
        reason: error.toString(),
      });
    }
};
