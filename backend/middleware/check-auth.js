const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "secret_this_should_be_longer");
    next();
  } catch (error) { // if we don't have a valid token then we will catch the error
    res.status(401).json({ message: "Auth failed in the check-auth.js file!" })
  }

};
