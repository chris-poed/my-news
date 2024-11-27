exports.postgresErrorHandler = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" })
    } else if (err.code === "23503") {
        res.status(404).send({ msg: "Article_id does not exist" })
    } else {
        next(err)
    }
}

exports.customErrorHandler = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err)
    }
}

exports.serverErrorHandler = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'})
}