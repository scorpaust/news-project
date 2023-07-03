const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Article = require("./models/article");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.1lf4jdl.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`
  )
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
  article.save().then((createdArticle) => {
    res
      .status(201)
      .json({
        message: "Article added successfully!",
        articleId: createdArticle._id,
      });
  });
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

app.delete("/api/articles/:id", (req, res, next) => {
  Article.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Article deleted!" });
  });
});

module.exports = app;
