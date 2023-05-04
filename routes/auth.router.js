// login [POST]
// signup [POST]
// verfiyEmail [POST]
// verfiyConfirm [PATCH]

const { signup, login } = require('../controllers/auth.controller');

const authRouter = require('express').Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);

module.exports = authRouter;
