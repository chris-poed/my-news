const db = require('../db/connection')

exports.fetchComments = (article_id) => {
    return db.query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments JOIN articles ON articles.article_id = comments.article_id WHERE comments.article_id = $1 ORDER BY comments.created_at DESC`, [article_id])
    .then(({ rows }) => {
        return rows
    })
}

exports.insertComment = (article_id, body) => {
    const queryValues = [article_id, body.user, body.body]
    return db.query(`INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`, queryValues)
    .then(( { rows }) => {
        return rows[0]
    })
}