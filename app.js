const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const {
  getArticle,
  getArticles,
  getComments,
  postComment,
  patchArticle,
} = require("./controllers/articles.controller");
const { deleteComment } = require("./controllers/comments.controller");
const app = express();

app.use(express.json());

//GET
app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles/:article_id/comments", getComments);

app.get("/api/articles", getArticles);

//POST
app.post("/api/articles/:article_id/comments", postComment);

//PATCH
app.patch("/api/articles/:article_id", patchArticle);

//DELETE
app.delete("/api/comments/:comment_id", deleteComment);

//Error Handling

//PSQL Errors
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42703" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
});


//Custom Error(s)
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

//Default
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
});

module.exports = app;
