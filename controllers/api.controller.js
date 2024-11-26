const endpointsJSON = require('../endpoints.json')
const {
    fetchTopics,
    fetchArticle,
    fetchArticles
} = require('../models/api.models')

exports.getApi = (req, res) => {
    res.status(200).send({ endpoints: endpointsJSON })
}

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
}

exports.getArticle = (req, res, next) => {
    const { article_id } = req.params
    fetchArticle(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({ articles })
    })
    .catch(next)
}