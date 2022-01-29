const authUser = require('./auth.controllers');
const characters = require('./characters.controllers');
const movies = require('./movies.controllers');

module.exports = {
    ...authUser,
    ...characters,
    ...movies
}