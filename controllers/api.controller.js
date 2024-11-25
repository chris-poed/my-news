const endpointsJSON = require('../endpoints.json')
const {
    fetchTopics,
    fetchArticle
} = require('../models/api.models')

exports.getApi = (req, res) => {
    res.status(200).send({ endpoints: endpointsJSON })
}

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
    })
}

exports.getArticle = (req, res, next) => {
    const { article_id } = req.params
    fetchArticle(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}