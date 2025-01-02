const articlesRouter = require("express").Router();

const  { 
    getArticle,
    getArticles,
    patchArticle,
    postArticle
} = require('../controllers/articles.controller');

const {
    getComments,
    postComment
} = require('../controllers/comments.controller')

articlesRouter
.route('/')
.get(getArticles)
.patch(patchArticle)
.post(postArticle)

articlesRouter
.route('/:article_id')
.get(getArticle)
.patch(patchArticle)

articlesRouter
.route('/:article_id/comments')
.get(getComments)
.post(postComment)

module.exports = articlesRouter