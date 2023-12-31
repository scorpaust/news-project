const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

exports.createUser = (req, res, next) => {
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
};

exports.userLogin = (req, res, next) => {
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
};
