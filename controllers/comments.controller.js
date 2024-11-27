const {
    fetchComments,
    insertComment
} = require('../models/comments.models')

const {
    checkArticleExists
} = require('../models/articles.models')

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
        res.status(201).send({ comment })
    })
    .catch(next)
}