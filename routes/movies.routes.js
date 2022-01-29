const { Router } = require('express');
const { check } = require('express-validator');
const { validateErrors, validateJWT } = require('../middlewares');

const {
    allMovies,
    getMovie,
    searchMoviesQuery,
    createMovie,
    updateMovie,
    deleteMovie,
    saveImgMovie
} = require('../controllers');

const router = Router();

router.get('/', [
    validateJWT,
    validateErrors
], allMovies);

router.get('/:id', [
    validateJWT,
    validateErrors
], getMovie);

router.get('/query', [
    validateJWT,
    validateErrors
], searchMoviesQuery);

router.post('/img/:id', [
    validateJWT,
    validateErrors
], saveImgMovie);

router.post('/', [
    validateJWT,
    check('title', 'The value is required').not().isEmpty(),
    check('creation_date', 'The value is required').not().isEmpty(),
    check('ranking', 'The value is required').not().isEmpty(),
    check('characters', 'The value is required').not().isEmpty(),
    validateErrors
], createMovie);

router.put('/:id', [
    validateJWT,
    validateErrors
], updateMovie);

router.delete('/:id', [
    validateJWT,
    validateErrors
], deleteMovie);

module.exports = router;