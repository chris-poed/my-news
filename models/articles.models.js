const db = require('../db/connection')

exports.fetchArticle = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Article_id does not exist'})
        }
        return rows[0];
    })
}

exports.fetchArticles = () => {
    let sqlQuery = 
    "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count, articles.article_img_url FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY 1 ORDER BY articles.created_at DESC "
    const queryValues = []
    return db.query(sqlQuery, queryValues).then(( { rows }) => {
        return rows;
    })
}


exports.checkArticleExists = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Article_id does not exist'})
        }
        return rows;
    })
}

exports.insertVotes = (article_id, body) => {
    const queryValues = [body.inc_votes, article_id]
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, queryValues)
    .then(( { rows }) => {
        return rows[0]
    })
}