const { response, request } = require('express');
const path = require('path');

const notFoundGet = (req = request, res = response) => {
    res.status(404)
        .json({
            msg: 'This route is not implemented'
        });
}

const notFoundPost = (req, res) => {
    res.status(404)
        .json({
            msg: 'This route is not implemented'
        });
}

const notFoundPut = (req, res) => {
    res.status(404)
        .json({
            msg: 'This route is not implemented'
        });
}

const notFoundPatch = (req, res) => {
    res.status(404)
        .json({
            msg: 'This route is not implemented'
        });
}

const notFoundDelete = (req, res) => {
    res.status(404)
        .json({
            msg: 'This route is not implemented'
        });
}

module.exports = {
    notFoundGet,
    notFoundPost,
    notFoundPut,
    notFoundPatch,
    notFoundDelete
}