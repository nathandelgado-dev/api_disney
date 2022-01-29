const { request, response } = require('express');
const { Character, Movie } = require('../models');
const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL);

const saveImgCloudinary = async(id, models) => {
    return new Promise((resolve, reject) => {
        async(req, res) => {
            try {
                switch (models) {
                    case 'character':
                        models = Character;
                        break;
                    case 'movie':
                        models = Movie;
                        break;

                    default:
                        reject = res.status(500).json({
                            msg: 'contact to administrator'
                        });
                        break;
                }
                const model = await models.findByPk(id);
                if (!model) {
                    reject = res.status(404).json({
                        msg: `The id ${id} not exist`
                    });
                }
                if (model.img) {
                    const nameArr = model.img.split('/');
                    const name = nameArr[nameArr.length - 1];
                    const [public_id] = name.split('.');
                    await cloudinary.uploader.destroy(public_id);
                }

                const { tempFilePath } = req.files.img;
                const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
                const img = secure_url;

                model.img = img;

                await model.save();

                resolve = res.status(201).json({
                    msg: 'The img saved',
                    character: model
                });
            } catch (err) {
                console.error(`No save img: ${err}`)
                reject = res.status(500).json({
                    msg: 'Contact to administrator',
                    error: err
                });
            }

        }
    });
}

module.exports = saveImgCloudinary;