const express = require("express")
const  { 
    getApi,
    getTopics
} = require('./controllers/api.controller')

const app = express()
app.use(express.json())

app.get('/api', getApi)
app.get('/api/topics', getTopics)

app.use((err, req, res, next) => {
 if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg })
 } else {
    next(err)
 }
})
app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'})
})

module.exports = app;