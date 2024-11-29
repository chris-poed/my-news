const apiRouter = require("express").Router();
const { getApi } = require("../controllers/api.controller")
const usersRouter = require("./users.router")
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router")
const topicsRouter = require("./topics.router");

apiRouter.get("/", getApi)
apiRouter.use('/users', usersRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/comments', commentsRouter)
apiRouter.use('/topics', topicsRouter)

module.exports = apiRouter
