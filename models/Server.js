const express = require('express');
const cors = require('cors');
const fileupload = require("express-fileupload");
const db = require('../db/connection');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            characters: '/api/characters',
            movies: '/api/movies',
        };

        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log('DB is conected')
        } catch (error) {
            throw new Error(error);
        }
    }

    middlewares() {
        //Cors
        this.app.use(cors());

        //Read and parse of body
        this.app.use(express.json());

        //Public patch
        this.app.use(express.static('public'));

        //FileUpload
        this.app.use(fileupload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.characters, require('../routes/characters.routes'));
        this.app.use(this.paths.movies, require('../routes/movies.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Runing in port: ${this.port}`);
        })
    }
}

module.exports = Server;