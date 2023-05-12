const {
  signupSchema,
  loginSchema,
  verfiyEmailSchema,
} = require('../validators/authSchemas');
const {
  signup,
  login,
  verfiyEmail,
  resetPassword,
} = require('../controllers/auth.controller');
const reqValidator = require('../middlewares/validator');
const authMiddleware = require('../middlewares/authentication');

const authRouter = require('express').Router();

authRouter.get('/', (req, res) => res.send('test auth'));
authRouter.post('/signup', reqValidator(signupSchema), signup);
authRouter.post('/login', reqValidator(loginSchema), login);
authRouter.get('/verify-email', reqValidator(verfiyEmailSchema), verfiyEmail);
authRouter.put('/reset-password', authMiddleware, resetPassword);

module.exports = authRouter;
