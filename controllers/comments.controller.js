const {
    fetchComments,
    insertComment,
    removeComment,
    insertCommentVotes
} = require('../models/comments.models')

const {
    checkArticleExists,
    checkCommentExists
} = require('../models/utils.models')

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

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    removeComment(comment_id).then(() => {
        res.status(204).send()
    })
    .catch(next)
}

exports.patchComment = (req, res, next) => {
    const { comment_id } = req.params
    const { body } = req
    const promises = [insertCommentVotes(comment_id, body)]
    promises.push(checkCommentExists(comment_id))

    Promise.all(promises)
    .then(([comment]) => {
        res.status(200).send({ comment })
    })
    .catch(next)
}
