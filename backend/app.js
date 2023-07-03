const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Article = require("./models/article");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect("")
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.error(err);
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/articles", (req, res, next) => {
  const article = new Article({
    title: req.body.title,
    subtitle: req.body.subtitle,
    content: req.body.content,
    image: req.body.image,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  article.save();
  res.status(201).json({ message: "Article added successfully!" });
});

app.get("/api/articles", async (req, res, next) => {
  Article.find().then((documents) => {
    console.log(documents);
    res.json({
      message: "Articles fetched successfully!",
      articles: documents,
    });
  });
});

module.exports = app;
