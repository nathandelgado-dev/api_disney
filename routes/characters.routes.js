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
    //TODO:validate query
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
    check('age', 'The value is required').not().isEmpty(),
    check('weight', 'The value is required').not().isEmpty(),
    check('history', 'The value is required').not().isEmpty(),
    check('movies', 'The value is required').not().isEmpty(),
    validateErrors
], createCharacter);

router.put('/:id', [
    validateJWT,
    validateErrors
], updateCharacter);

router.delete('/:id', [
    validateJWT,
    validateErrors
], deleteCharacter);



module.exports = router;