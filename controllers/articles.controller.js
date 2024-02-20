const { selectArticles } = require("../models/articles.model");
const { fetchArticle } = require("../models/articles.model");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  selectArticles(sort_by, order)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
