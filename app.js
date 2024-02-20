const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const { getArticle } = require("./controllers/articles.controller");
const app = express();

//GET
app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticle);



//Error Handling 
//Custom Error(s)
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

//PSQL Errors
app.use((err, req, res, next) => {
  console.log(err);
  if (err.code === "22P02") {
    res.status(400).send({msg: "Bad request"});
  }else{
    next(err)
  }
});

//Default
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
});

module.exports = app;
