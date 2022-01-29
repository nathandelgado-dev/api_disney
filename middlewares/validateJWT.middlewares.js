const { request, response } = require('express');
const { User } = require('../models');
const jwt = require('jsonwebtoken');



const validateJWT = async(req = request, res = response, next) => {
    const token = req.header('x-disney-key');
    if (!token) {
        return res.status(401).json({
            msg: 'The token is required'
        });
    }

    try {
        const { email } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(401).json({
                msg: 'The token is invalid'
            });
        }

        req.user = user;

        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            msg: 'The token is invalid'
        });
    }
}


module.exports = {
    validateJWT
}