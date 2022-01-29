const { Router } = require('express');
const { check } = require('express-validator');
const { validateErrors, validateJWT } = require('../middlewares');
const {
    allCharacters,
    searchCharactersQuery,
    getCharacter,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    saveImgCharacter
} = require('../controllers');

const router = Router();

router.get('/query', [
    validateJWT,
    check('age', 'The value not is a number').if(check('age').exists()).isNumeric(),
    check('movies', 'The value not is a number').if(check('movies').exists()).isNumeric(),
    check('name', 'The value not is a string').if(check('name').exists()).isString(),
    validateErrors
], searchCharactersQuery);

router.get('/', [
    validateJWT,
    validateErrors
], allCharacters);

router.get('/:id', [
    validateJWT,
    validateErrors
], getCharacter);

router.post('/img/:id', [
    validateJWT,
    validateErrors
], saveImgCharacter);

router.post('/', [
    validateJWT,
    check('name', 'The value is required').not().isEmpty(),
    check('name', 'The value not is a string').if(check('name').exists()).isString(),
    check('age', 'The value is required').not().isEmpty(),
    check('age', 'The value not is a number').if(check('age').exists()).isNumeric(),
    check('weight', 'The value is required').not().isEmpty(),
    check('weight', 'The value not is a number').if(check('weight').exists()).isNumeric(),
    check('history', 'The value is required').not().isEmpty(),
    check('history', 'The value not is a string').if(check('history').exists()).isString(),
    check('movies', 'The value not is a string').if(check('movies').exists()).isString(),
    validateErrors
], createCharacter);

router.put('/:id', [
    validateJWT,
    check('name', 'The value not is a string').if(check('name').exists()).isString(),
    check('age', 'The value not is a number').if(check('age').exists()).isNumeric(),
    check('weight', 'The value not is a number').if(check('weight').exists()).isNumeric(),
    check('history', 'The value not is a string').if(check('history').exists()).isString(),
    check('movies', 'The value not is a string').if(check('movies').exists()).isString(),
    validateErrors
], updateCharacter);

router.delete('/:id', [
    validateJWT,
    validateErrors
], deleteCharacter);



module.exports = router;