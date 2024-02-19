const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const app = express();

//GET
app.get("/api/:endpoint", getTopics);

//Error Handling 
app.use((err, req, res, next) => {
  if (err.code === "42601") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(error);
  }
});


app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
});

module.exports = app;
