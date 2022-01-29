const { request, response } = require('express');
const { Op } = require("sequelize");
const cloudinary = require('cloudinary').v2
const { Character, User } = require('../models');
const { validatetypeFiles } = require('../helpers');

cloudinary.config(process.env.CLOUDINARY_URL);

const allCharacters = async(req, res = response) => {
    try {
        const characters = await Character.findAll();
        if (!characters) {
            return res.status(404).json({
                msg: 'No characters available'
            });
        }
        return res.status(200).json({
            count: characters.length,
            characters
        });
    } catch (err) {
        console.error(`No show character: ${err}`)
        res.status(500).json({
            msg: 'Contact to administrator'
        });
    }
}

const getCharacter = async(req, res = response) => {
    const { id } = req.params;

    try {
        const character = await Character.findByPk(id);

        if (character) {
            return res.status(200).json({
                character
            });
        }
        res.status(404).json({
            msg: `Id ${ id } not exist`
        });
    } catch (err) {
        console.error(`No show character: ${err}`)
        res.status(500).json({
            msg: 'Contact to administrator'
        });
    }

}


const createCharacter = async(req, res = response) => {
    const { age, weight, history, movies } = req.body;
    let { name } = req.body;
    name = name.toLowerCase();

    try {
        const existName = await Character.findOne({
            where: {
                name: name
            }
        });

        if (existName) {
            return res.status(400).json({
                msg: `The character ${name} exist`
            });
        }

        const dataCharacter = {
            name,
            age,
            weight,
            history,
            movies
        };

        const character = new Character(dataCharacter);
        await character.save();

        res.status(201).json({
            msg: 'The character saved',
            character
        });
    } catch (err) {
        console.error(`No save character: ${err}`)
        res.status(500).json({
            msg: 'Contact to administrator'
        });
    }
}

const saveImgCharacter = async(req, res = response) => {
    const { id } = req.params;
    let img = '';

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

        const character = await Character.findByPk(id);
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

const updateCharacter = async(req, res = response) => {
    const { age, weight, history, movies } = req.body;
    const { id } = req.params;
    let { name } = req.body;

    try {
        const character = await Character.findByPk(id);

        if (!character) {
            return res.status(404).json({
                msg: `The character id ${id} not exist`
            });
        }

        if (name) {
            name = name.toLowerCase();

            const existName = await Character.findOne({
                where: {
                    name: name
                }
            });

            if (existName) {
                return res.status(400).json({
                    msg: `The character ${name} exist`
                });
            }
        }

        const dataCharacter = {
            name,
            age,
            weight,
            history,
            movies
        };

        await character.update(dataCharacter);
        res.status(201).json({
            msg: 'The character updated',
            character
        });
    } catch (err) {
        console.error(`No save character: ${err}`)
        res.status(500).json({
            msg: 'Contact to administrator'
        });
    }
}

const deleteCharacter = async(req, res) => {
    const { id } = req.params;
    try {
        const character = await Character.findByPk(id);

        if (!character) {
            return res.status(404).json({
                msg: `The character id ${id} not exist`
            })
        }

        //delete image
        if (character.img) {
            const nameArr = character.img.split('/');
            const name = nameArr[nameArr.length - 1];
            const [public_id] = name.split('.');
            await cloudinary.uploader.destroy(public_id);
        }

        character.destroy();

        res.status(200).json({
            msg: 'Character deleted',
            character
        })
    } catch (err) {
        console.error(`Can not delete character: ${err}`)
        res.status(500).json({
            msg: 'Contact to administrator'
        });
    }
}

const searchCharactersQuery = async(req, res = response) => {
    const { name = '', age = 0, movies = '', weight = 0 } = req.query;

    try {
        const characters = await Character.findAll({
            where: {
                [Op.or]: [
                    { name: name },
                    { age: age },
                    { movies: movies },
                    { weight: weight }
                ]
            }
        });

        if (!characters.length) {
            res.status(404).json({
                msg: 'Not exist characters with for these query'
            })
        }

        res.status(200).json({
            count: characters.length,
            characters: characters
        });
    } catch (err) {
        console.error(`Can not query character: ${err}`)
        res.status(500).json({
            msg: 'Contact to administrator'
        });
    }
}

module.exports = {
    allCharacters,
    searchCharactersQuery,
    getCharacter,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    saveImgCharacter
}