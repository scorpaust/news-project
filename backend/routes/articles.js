const express = require("express");
const Article = require("../models/article");
const router = express.Router();
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const article = new Article({
      title: req.body.title,
      subtitle: req.body.subtitle,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    article.save().then((createdArticle) => {
      res.status(201).json({
        message: "Article added successfully!",
        article: {
          ...createdArticle,
          id: article._id,
        },
      });
    });
  }
);

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const article = new Article({
      _id: req.body.id,
      title: req.body.title,
      subtitle: req.body.subtitle,
      content: req.body.content,
      imagePath: imagePath,
      createdAt: req.body.createdAt,
      updatedAt: new Date(),
    });
    Article.updateOne({ _id: req.params.id }, article).then((result) => {
      console.log(result);
      res.status(200).json({ message: "Update successfull!" });
    });
  }
);

router.get("", async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const articleQuery = Article.find();
  let fetchedArticles = undefined;
  if (pageSize && currentPage) {
    articleQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  articleQuery.then((documents) => {
    fetchedArticles = documents;
    return Article.count().then((count) => {
      res.json({
        message: "Articles fetched successfully!",
        articles: fetchedArticles,
        maxArticles: count,
      });
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
