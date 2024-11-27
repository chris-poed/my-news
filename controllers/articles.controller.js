const {
    fetchArticle,
    fetchArticles,
    insertVotes,
} = require('../models/articles.models')

const {
    checkArticleExists
} = require('../models/utils.models')

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

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params
    const { body } = req
    const promises = [insertVotes(article_id, body)]
    if (article_id) {
        promises.push(checkArticleExists(article_id))
    }
    
    Promise.all(promises)
    .then(([article]) => {
        res.status(200).send({ article })
    })
    .catch(next)
}
