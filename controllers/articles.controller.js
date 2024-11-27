const {
    fetchArticle,
    fetchArticles,
    fetchComments,
    checkArticleExists,
    insertComment
} = require('../models/articles.models')

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

exports.getComments = (req, res, next) => {
    const { article_id } = req.params
    const promises = [fetchComments(article_id)]
    if(article_id) {
        promises.push(checkArticleExists(article_id))
    }
    Promise.all(promises)
    .then(([comments]) => {
        res.status(200).send({ comments })
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const { article_id } = req.params
    const { body } = req
    const promises = [insertComment(article_id, body)]
    if (article_id) {
        promises.push(checkArticleExists(article_id))
    }
    
    Promise.all(promises)
    .then(([comment]) => {
        console.log(comment, "<---comment in promise")
        res.status(201).send({ comment })
    })
/*     insertComment(article_id, body).then((comment) => {
        res.status(201).send({ comment })
    }) */
    .catch(next)
}