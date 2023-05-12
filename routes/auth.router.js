const {
  signupSchema,
  loginSchema,
  verfiyEmailSchema,
  changePasswordSchema,
} = require('../validators/authSchemas');
const {
  signup,
  login,
  verfiyEmail,
  changePassword,
  resetPasswordRequest,
} = require('../controllers/auth.controller');
const reqValidator = require('../middlewares/validator');
const authMiddleware = require('../middlewares/authentication');

const authRouter = require('express').Router();

authRouter.get('/', (req, res) => res.send('test auth'));
authRouter.post('/signup', reqValidator(signupSchema), signup);
authRouter.post('/login', reqValidator(loginSchema), login);
authRouter.get('/verify-email', reqValidator(verfiyEmailSchema), verfiyEmail);
authRouter.put(
  '/change-password',
  reqValidator(changePasswordSchema),
  authMiddleware,
  changePassword
);
authRouter.post('/resetpassrequest', resetPasswordRequest);

module.exports = authRouter;
