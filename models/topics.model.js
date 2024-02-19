const db = require("../db/connection.js");
const format = require('pg-format');

exports.fetchTopics = (endpoint) => {
    const queryString = format("SELECT * FROM %s;", endpoint)
  return db.query(queryString)
  .then(({ rows }) => {
    return rows;
  });
};
