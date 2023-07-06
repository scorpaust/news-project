const express = require("express");
const Article = require("../models/article");
const router = express.Router();

router.post("", (req, res, next) => {
  const article = new Article({
    title: req.body.title,
    subtitle: req.body.subtitle,
    content: req.body.content,
    image: req.body.image,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  article.save().then((createdArticle) => {
    res.status(201).json({
      message: "Article added successfully!",
      articleId: createdArticle._id,
    });
  });
});

router.put("/:id", (req, res, next) => {
  const article = new Article({
    _id: req.body.id,
    title: req.body.title,
    subtitle: req.body.subtitle,
    content: req.body.content,
    image: req.body.image,
    createdAt: req.body.createdAt,
    updatedAt: new Date(),
  });
  Article.updateOne({ _id: req.params.id }, article).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Update successfull!" });
  });
});

router.get("", async (req, res, next) => {
  Article.find().then((documents) => {
    console.log(documents);
    res.json({
      message: "Articles fetched successfully!",
      articles: documents,
    });
  });
});

router.get("/:id", (req, res, next) => {
  Article.findById(req.params.id).then((article) => {
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({ message: "Article not found!" });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Article.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Article deleted!" });
  });
});

module.exports = router;
