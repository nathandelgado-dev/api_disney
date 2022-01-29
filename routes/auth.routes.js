const { Router } = require('express');
const { check } = require('express-validator');
const { validateErrors } = require('../middlewares');
const {
    createUser,
    signinUser
} = require('../controllers');

const router = Router();

router.post('/singup', [
    check('email', 'The value is required').not().isEmpty(),
    check('email', 'The value is invalid').isEmail(),
    check('pass', 'The value is required').not().isEmpty(),
    check('pass', 'Requiered 8 min characters').isLength({ min: 8 }),
    validateErrors
], createUser);

router.post('/login', [
    check('email', 'The value is required').not().isEmpty(),
    check('email', 'The value is invalid').isEmail(),
    check('pass', 'The value is required').not().isEmpty(),
    check('pass', 'Requiered 8 min characters').isLength({ min: 8 }),
    validateErrors
], signinUser);


module.exports = router;