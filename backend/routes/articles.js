const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const ArticleController = require("../controllers/articles");

router.post("", checkAuth, extractFile, ArticleController.createArticle);

router.put("/:id", checkAuth, extractFile, ArticleController.updateArticle);

router.get("", ArticleController.getArticles);

router.get("/:id", ArticleController.getArticle);

router.delete("/:id", checkAuth, ArticleController.deleteArticle);

module.exports = router;
