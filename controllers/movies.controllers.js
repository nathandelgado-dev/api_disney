const { request, response } = require('express');
const { Op } = require("sequelize");
const cloudinary = require('cloudinary').v2
const { Movie } = require('../models');
const { validatetypeFiles } = require('../helpers')

cloudinary.config(process.env.CLOUDINARY_URL);

const saveImgMovie = async(req, res = response) => {
    const { id } = req.params;
    try {
        if (!req.files || !req.files.img) {
            return res.status(400).json({
                msg: `The image attached or key not exist`
            });
        }
        //validate extensions permitted
        const file = req.files.img;
        validatetypeFiles(file).catch(msg => {
            res.status(400).json({
                msg: msg
            });
        });

        const character = await Movie.findByPk(id);
        if (!character) {
            return res.status(404).json({
                msg: `The id ${id} not exist`
            });
        }
        if (character.img) {
            const nameArr = character.img.split('/');
            const name = nameArr[nameArr.length - 1];
            const [public_id] = name.split('.');
            await cloudinary.uploader.destroy(public_id);
        }

        const { tempFilePath } = req.files.img;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        img = secure_url;

        character.img = img;

        await character.save();

        res.status(201).json({
            msg: 'The img saved',
            character
        });
    } catch (err) {
        console.error(`No save img: ${err}`)
        res.status(500).json({
            msg: 'Contact to administrator'
        });
    }
}

const allMovies = async(req, res = response) => {
    try {
        const movies = await Movie.findAll();
        if (movies) {
            return res.status(200).json({
                count: movies.length,
                characters: movies
            });
        }
        res.status(404).json({
            msg: 'No movies available'
        });
    } catch (err) {
        console.error(`No show character: ${err}`)
        res.status(500).json({
            msg: 'Contact to administrator'
        });
    }
}

const getMovie = async(req, res = response) => {
    const { id } = req.params;
    try {
        const movie = await Movie.findByPk(id);

        if (!movie) {
            return res.status(404).json({
                msg: `Id ${ id } not exist`
            });
        }
        res.status(200).json({
            movie
        });
    } catch (err) {
        console.error(`No show character: ${err}`)
        res.status(500).json({
            msg: 'Contact to administrator'
        });
    }
}

const createMovie = async(req, res) => {
    const { creation_date, ranking, characters } = req.body;
    let { title } = req.body;
    title = title.toLowerCase();

    try {
        const existMovie = await Movie.findOne({
            where: {
                title: title
            }
        });

        if (existMovie) {
            return res.status(400).json({
                msg: `The movie ${title} exist`
            });
        }

        const dataMovie = {
            title,
            creation_date,
            ranking,
            characters
        };

        const movie = new Movie(dataMovie);
        await movie.save();

        res.status(201).json({
            msg: 'The movie saved',
            movie
        });
    } catch (err) {
        console.error(`No save movie: ${err}`)
        res.status(500).json({
            msg: 'Contact to administrator'
        });
    }
}

const updateMovie = async(req, res) => {
    const { creation_date, ranking, characters } = req.body;
    const { id } = req.params;
    let { title } = req.body;

    try {
        const movie = await Movie.findByPk(id);

        if (!movie) {
            return res.status(404).json({
                msg: `The movie id ${id} not exist`
            });
        }

        if (title) {
            title = title.toLowerCase();

            const existTitle = await Movie.findOne({
                where: {
                    title: title
                }
            });

            if (existTitle) {
                return res.status(400).json({
                    msg: `The movie ${title} exist`
                });
            }
        }

        const dataMovie = {
            title,
            creation_date,
            ranking,
            characters
        }

        await movie.update(dataMovie);

        res.status(201).json({
            msg: 'The movie updated',
            movie
        });
    } catch (err) {
        console.error(`No save movie: ${err}`)
        res.status(500).json({
            msg: 'Contact to administrator'
        });
    }
}

const deleteMovie = async(req, res) => {
    const { id } = req.params;
    try {
        const movie = await Movie.findByPk(id);

        if (!movie) {
            return res.status(404).json({
                msg: `The movie id ${id} not exist`
            })
        }

        //delete image
        if (movie.img) {
            const nameArr = movie.img.split('/');
            const name = nameArr[nameArr.length - 1];
            const [public_id] = name.split('.');
            await cloudinary.uploader.destroy(public_id);
        }

        movie.destroy();

        res.status(200).json({
            msg: 'Movie deleted',
            movie
        })
    } catch (err) {
        console.error(`Can not delete movie: ${err}`)
        res.status(500).json({
            msg: 'Contact to administrator'
        });
    }
}

const searchMoviesQuery = async(req, res = response) => {
    //TODO:get character with same name
    const { title = '', order } = req.query;
    const { genre = 0 } = req.query;
    try {
        const movies = await Movie.findAll({
            where: {
                [Op.or]: [
                    { title: title },
                    { genre_id: genre }
                ]
            }
        })

        if (!movies.length) {
            return res.status(404).json({
                msg: 'Not exist movies with for these query'
            });
        }
        //Order query
        if (order == 'ASC') {
            const ascMovies = movies.sort((a, b) => new Date(a.creation_date) - new Date(b.creation_date));
            return res.status(200).json({
                count: ascMovies.length,
                movies: ascMovies
            });
        }
        if (order == 'DESC') {
            const ascMovies = movies.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
            return res.status(200).json({
                count: ascMovies.length,
                movies: ascMovies
            });
        }

        res.status(200).json({
            count: movies.length,
            movies: movies
        });
    } catch (error) {
        console.error(`Can not query movie: ${err}`)
        res.status(500).json({
            msg: 'Contact to administrator'
        });
    }
}

module.exports = {
    allMovies,
    getMovie,
    searchMoviesQuery,
    createMovie,
    updateMovie,
    deleteMovie,
    saveImgMovie
}