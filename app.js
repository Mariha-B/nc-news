const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const {
  getArticle,
  getArticles,
  getComments,
  postComment,
} = require("./controllers/articles.controller");
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


//Error Handling

//PSQL Errors
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42703" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((req, res, next) => {
  res.status(400).send({ msg: "Bad Request" });
});

//Custom Error(s)
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

//Default
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
});

module.exports = app;
