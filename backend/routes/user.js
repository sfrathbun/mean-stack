const express = require('express');

// must run "npm install --save bcrypt" to hash passwords
const bcrypt = require('bcrypt');
// must run "npm install --save jsonwebtoken" for JWT to work
const jwt = require("jsonwebtoken");

// we must require the user model
const User = require("../models/user");
const user = require('../models/user');

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        })
    });
});

// request response, next
router.post("/login", (req, res, next) => {
  // first we want to validate whether the credentials are valid and if they are, then we can create a token to validate the user.
  let fetchedUser;
  User.findOne({ email: req.body.email }) // we are finding an instance of the user model in the database.
    .then(user => {
      if (!user) {  // checking to see if there is no user
        return res.status(401).json({
          message: "Auth failed. No User created"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password) // the req.body is the input that the user types in the form. user.password is the password we have stored in the database
    })
    .then(result => {
      if (!result) { // here we are checking if the result of the bcrypt compare fails
        return res.status(401).json({
          message: "Auth failed. Are you sure this is your password?"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600 // time until the token expires in seconds
      });
    })
    .catch(err => { // this is going to catch any unhandled errors
      return res.status(401).json({
        message: "Invalid authentication credentials! Last Catch err"
      });
    });
});

module.exports = router;
