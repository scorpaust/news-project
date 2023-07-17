const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user.save().then((result) => {
        res.status(201).json({
          message: "User created",
          result: result,
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Invalid authentication credentials!",
      });
    });
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(401).json({ message: "Auth failed!" });
    }
    return bcrypt
      .compare(req.body.password, user.password)
      .then((result) => {
        if (!result) {
          return res.status(401).json({ message: "Auth failed!" });
        }
        const token = jwt.sign(
          { email: user.email, userId: user._id },
          process.env.TOKEN_SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          message: "User successfully authenticated!",
          token: token,
          expiresIn: 3600,
          userId: user._id,
        });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(401)
          .json({ message: "Invalid authentication credentials!" });
      });
  });
});

module.exports = router;
