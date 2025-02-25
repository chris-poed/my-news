const db = require("../db/connection");
const { articleData } = require("../db/data/test-data");

exports.fetchArticle = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count, articles.article_img_url FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article_id does not exist",
        });
      }
      return rows[0];
    });
};

exports.fetchArticles = (sortBy, orderBy, topic) => {
  const validSort = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrder = ["ASC", "DESC"];
  if (!validSort.includes(sortBy) || !validOrder.includes(orderBy)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }
  let sqlQuery =
    "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, COALESCE(COUNT(comments.article_id), 0) AS comment_count, articles.article_img_url FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id ";
  const queryValues = [];

  if (topic) {
    sqlQuery += `WHERE articles.topic = $1 `;
    queryValues.push(topic);
  }

  sqlQuery += `GROUP BY articles.article_id, 
    articles.title, 
    articles.topic, 
    articles.author, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url `;

  sortBy === "comment_count"
    ? (sqlQuery += `ORDER BY comment_count ${orderBy} `)
    : (sqlQuery += `ORDER BY articles.${sortBy} ${orderBy} `);

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.insertVotes = (article_id, body) => {
  const queryValues = [body.inc_votes, article_id];
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      queryValues
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.insertArticle = (body) => {
  const queryValues = [body];
  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      queryValues
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
