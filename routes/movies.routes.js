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

router.get('/query', [
    validateJWT,
    check('order', 'The value not is correct, requiered ASC or DESC').if(check('order').exists()).matches(/(ASC)|(DESC)/),
    check('genre', 'The value not is a number').if(check('genre').exists()).isNumeric(),
    check('title', 'The value not is a string').if(check('title').exists()).isString(),
    validateErrors
], searchMoviesQuery);

router.get('/', [
    validateJWT,
    validateErrors
], allMovies);

router.get('/:id', [
    validateJWT,
    validateErrors
], getMovie);


router.post('/img/:id', [
    validateJWT,
    validateErrors
], saveImgMovie);

router.post('/', [
    validateJWT,
    check('title', 'The value is required').not().isEmpty(),
    check('title', 'The value not is a string').if(check('title').exists()).isString(),
    check('creation_date', 'The value is required').not().isEmpty(),
    check('ranking', 'The value is required').not().isEmpty(),
    check('characters', 'The value not is a string').if(check('characters').exists()).isString(),
    validateErrors
], createMovie);

router.put('/:id', [
    validateJWT,
    check('title', 'The value not is a string').if(check('title').exists()).isString(),
    check('creation_date', 'The value not is a date, example 1991-12-31').if(check('creation_date').exists()).isDate(),
    check('ranking', 'The value not is a number between 1 and 5').if(check('ranking').exists()).matches(/[1-5]/),
    check('characters', 'The value not is a string').if(check('characters').exists()).isString(),
    validateErrors
], updateMovie);

router.delete('/:id', [
    validateJWT,
    validateErrors
], deleteMovie);

module.exports = router;