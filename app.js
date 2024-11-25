const express = require("express")
const  { 
    getApi,
    getTopics,
    getArticle
} = require('./controllers/api.controller')

const app = express()

app.get('/api', getApi)
app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticle)


app.use((err, req, res, next) => {
    console.log(err, "<---error in 1st app.use")
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.log(err.code, "err.code in 2nd app.use")
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" })
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'})
})

module.exports = app;