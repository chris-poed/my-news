const db = require('../db/connection')

exports.checkArticleExists = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Article_id does not exist'})
        }
        return rows;
    })
}

exports.checkTopicExists = (topic) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({
                status: 404,
                msg: "Topic not found"
            })
        }
        return rows
    })
}

exports.checkCommentExists = (comment_id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id]).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Comment_id does not exist'})
        }
        return rows;
    })
}