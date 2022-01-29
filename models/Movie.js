const { DataTypes } = require('sequelize');
const db = require('../db/connection');

const Movie = db.define('Movie', {
    title: {
        type: DataTypes.STRING
    },
    creation_date: {
        type: DataTypes.DATE
    },
    ranking: {
        type: DataTypes.INTEGER
    },
    characters: {
        type: DataTypes.STRING
    },
    img: {
        type: DataTypes.STRING
    },
    genre_id: {
        type: DataTypes.BIGINT
    }
});

module.exports = Movie;