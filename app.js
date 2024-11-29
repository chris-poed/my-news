const express = require("express")

const apiRouter = require("./routes/api.router");

const { 
    postgresErrorHandler, 
    customErrorHandler, 
    serverErrorHandler, 
    endpointErrorHandler
} = require("./errors")

const app = express()

app.use(express.json())

app.use('/api', apiRouter)

app.all("*", endpointErrorHandler)
app.use(postgresErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app;