const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const app = express();

//GET
app.get("/api/topics", getTopics);

//Error Handling

app.use((err, res, req, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
});

module.exports = app;
