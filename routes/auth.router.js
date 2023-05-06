// login [POST]
// signup [POST]
// verfiyEmail [POST]
// verfiyConfirm [PATCH]

const { signup, login, verfiyEmail } = require('../controllers/auth.controller');

const authRouter = require('express').Router();

authRouter.get('/' , (req , res)=>res.send('test auth'))
authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.get('/verify', verfiyEmail);

module.exports = authRouter;
