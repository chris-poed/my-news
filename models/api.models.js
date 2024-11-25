const db = require('../db/connection')

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics').then(({ rows }) => {
        return rows
    })
}
exports.fetchArticle = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Article_id does not exist'})
        }
        return rows[0];
    })
}