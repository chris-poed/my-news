const express = require("express")
const cors = require('cors');



const apiRouter = require("./routes/api.router");

const { 
    postgresErrorHandler, 
    customErrorHandler, 
    serverErrorHandler, 
    endpointErrorHandler
} = require("./errors")

const app = express()

app.use(cors());

app.use(express.json())

app.use('/api', apiRouter)

app.all("*", endpointErrorHandler)
app.use(postgresErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app;