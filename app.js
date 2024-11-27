const express = require("express")

const  { 
    getApi,
} = require('./controllers/api.controller')

const  { 
    getTopics,
} = require('./controllers/topics.controller')

const  { 
    getArticle,
    getArticles,
    patchArticle
} = require('./controllers/articles.controller')

const {
    getComments,
    postComment,
    deleteComment
} = require('./controllers/comments.controller')

const { 
    postgresErrorHandler, 
    customErrorHandler, 
    serverErrorHandler 
} = require("./errors")

const app = express()

app.use(express.json())

app.get('/api', getApi)
app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticle)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getComments)
app.post('/api/articles/:article_id/comments', postComment)
app.patch('/api/articles/:article_id', patchArticle)
app.delete('/api/comments/:comment_id', deleteComment)

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Endpoint not found" })
})
app.use(postgresErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app;