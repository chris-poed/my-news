const endpointsJSON = require('../endpoints.json')
const {
    fetchTopics
} = require('../models/api.models')

exports.getApi = (req, res) => {
    res.status(200).send({ endpoints: endpointsJSON })
}

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
    })
}
