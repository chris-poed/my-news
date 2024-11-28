const {
    fetchArticle,
    fetchArticles,
    insertVotes,
} = require('../models/articles.models')

const {
    checkArticleExists,
    checkTopicExists
} = require('../models/utils.models')

exports.getArticle = (req, res, next) => {
    const { article_id } = req.params
    fetchArticle(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    const sortBy = req.query.sort_by || "created_at"
    const orderBy = req.query.order || "DESC"
    const topic = req.query.topic
    const promises = [fetchArticles(sortBy, orderBy, topic)]
    if (topic) {
        promises.push(checkTopicExists(topic))
    }
    Promise.all(promises)
    .then(([articles]) => {
        res.status(200).send({ articles })
    })
    .catch(next)
}

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params
    const { body } = req
    const promises = [insertVotes(article_id, body)]
    promises.push(checkArticleExists(article_id))

    Promise.all(promises)
    .then(([article]) => {
        res.status(200).send({ article })
    })
    .catch(next)
}
