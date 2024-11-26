const express = require("express")
const  { 
    getApi,
    getTopics,
    getArticle,
    getArticles
} = require('./controllers/api.controller')

const { //endpointErrorHandler, 
    postgresErrorHandler, 
    customErrorHandler, 
    serverErrorHandler 
} = require("./errors")

const app = express()

app.get('/api', getApi)
app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticle)
app.get('/api/articles', getArticles)

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Endpoint not found" })
})

//app.all(endpointErrorHandler)
app.use(postgresErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app;