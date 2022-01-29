const { DataTypes } = require('sequelize');
const db = require('../db/connection');

const Character = db.define('Character', {
    name: {
        type: DataTypes.STRING
    },
    age: {
        type: DataTypes.INTEGER
    },
    weight: {
        type: DataTypes.INTEGER
    },
    history: {
        type: DataTypes.STRING
    },
    movies: {
        type: DataTypes.BIGINT
    },
    img: {
        type: DataTypes.STRING
    }

});

module.exports = Character;