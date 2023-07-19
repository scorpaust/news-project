const Article = require("../models/article");

exports.createArticle = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const article = new Article({
    title: req.body.title,
    subtitle: req.body.subtitle,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  article
    .save()
    .then((createdArticle) => {
      res.status(201).json({
        message: "Article added successfully!",
        article: {
          ...createdArticle,
          id: article._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Failed creating an article...",
      });
    });
};

exports.updateArticle = (req, res, next) => {
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
    creator: req.userData.userId,
    createdAt: req.body.createdAt,
    updatedAt: new Date(),
  });
  Article.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    article
  )
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update successfull!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update the article...",
      });
    });
};

exports.getArticles = async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const articleQuery = Article.find();
  let fetchedArticles = undefined;
  if (pageSize && currentPage) {
    articleQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  articleQuery.then((documents) => {
    fetchedArticles = documents;
    return Article.count()
      .then((count) => {
        res.json({
          message: "Articles fetched successfully!",
          articles: fetchedArticles,
          maxArticles: count,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Failed to get articles...",
        });
      });
  });
};

exports.getArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .then((article) => {
      if (article) {
        res.status(200).json(article);
      } else {
        res.status(404).json({ message: "Article not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Failed to get the article...",
      });
    });
};

exports.deleteArticle = (req, res, next) => {
  Article.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Article Deleted!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Failed deleting article...",
      });
    });
};
