const db = require("../db/connection.js");
const format = require("pg-format");
const { fetchTopics } = require("./topics.model.js");

exports.fetchArticle = (article_id) => {
  const queryString = `
    SELECT
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.body,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
  COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
  `;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "article does not exist" });
    }
    return rows[0];
  });
};

exports.selectArticles = (
  topic = "%",
  sort_by = "created_at",
  order = "DESC"
) => {
  // Greenlist
  const validOrders = ["ASC", "DESC"];
  const validSort = ["created_at", "votes", "comment_count"];
  if (!validOrders.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  if (!validSort.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return fetchTopics()
    .then((topics) => {
      const foundTopic = topics.find((top) => top.slug === topic);
      if (!foundTopic && topic !=='%') {
        return Promise.reject({ status: 404, msg: "topic does not exist" });
      }
      const queryString = format(
        `SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
      FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.topic LIKE %L
      GROUP BY articles.article_id
      ORDER BY articles.%I %s;`,
        topic,
        sort_by,
        order
      );
      return queryString;
    })
    .then((queryString) => {
      return db.query(queryString);
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return [];
      }
      return rows;
    });
};

exports.selectComments = (
  sort_by = "created_at",
  order = "DESC",
  article_id
) => {
  // Greenlist
  const validOrders = ["ASC", "DESC"];
  if (!validOrders.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return this.fetchArticle(article_id)
    .then(() => {
      const queryString = format(
        `SELECT 
        comments.author,
        comments.body,
        comments.article_id,
        comments.created_at,
        comments.votes,
        comments.comment_id
      FROM comments LEFT JOIN articles ON comments.article_id = articles.article_id
      WHERE articles.article_id = %L
      ORDER BY comments.%I %s;`,
        article_id,
        sort_by,
        order
      );

      return db.query(queryString);
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (newComment) => {
  const { body, author, article_id } = newComment;
  return db
    .query(
      `INSERT INTO comments
                (body, author, article_id)
                VALUES
                ($1, $2, $3)
                RETURNING *`,
      [body, author, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  if (!inc_votes) {
    return this.fetchArticle(article_id);
  }
  return db
    .query(
      `UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return rows[0];
    });
};
