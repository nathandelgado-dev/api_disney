const { DataTypes } = require('sequelize');
const db = require('../db/connection');

const User = db.define('User', {
    email: {
        type: DataTypes.STRING
    },
    pass: {
        type: DataTypes.STRING
    }
});

module.exports = User;