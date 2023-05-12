const { signupSchema, loginSchema, verfiyEmailSchema } = require('../configs/schemas');
const { signup, login, verfiyEmail } = require('../controllers/auth.controller');
const reqValidator = require('../middlewares/validator');

const authRouter = require('express').Router();

authRouter.get('/', (req, res) => res.send('test auth'));
authRouter.post('/signup', reqValidator(signupSchema), signup);
authRouter.post('/login', reqValidator(loginSchema), login);
authRouter.get('/verify-email', reqValidator(verfiyEmailSchema), verfiyEmail);

module.exports = authRouter;
