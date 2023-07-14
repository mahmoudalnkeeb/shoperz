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
  resetPasswordRequest,
  resetPassword,
  sendVerifyEmail,
  validateResetToken,
} = require('../controllers/auth.controller');
const reqValidator = require('../middlewares/validator');
const authMiddleware = require('../middlewares/authentication');

const authRouter = require('express').Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User signup
 *     description: Registers a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       200:
 *         description: User successfully signed up.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignupResponse'
 */
authRouter.post('/signup', reqValidator(signupSchema), signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and generates an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 */
authRouter.post('/login', reqValidator(loginSchema), login);

authRouter.get('/verify-email', reqValidator(verfiyEmailSchema), verfiyEmail);
authRouter.get('/send-verify-email', authMiddleware, sendVerifyEmail);
authRouter.post('/resetpassword', resetPasswordRequest);
authRouter.post('/resetpassword/:resetToken', resetPassword);
authRouter.post('/validateresettoken', validateResetToken);

/**
 * @swagger
 * components:
 *   schemas:
 *     SignupRequest:
 *       type: object
 *       properties:
 *         fullname:
 *           type: string
 *           description: The user's full name.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           description: The user's password (must be at least 8 characters long and contain at least one letter and one special character).
 *         phone:
 *           type: string
 *           description: The user's phone number.
 *
 *     SignupResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A success message indicating the user has been signed up successfully.
 *
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password.
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: An access token for the authenticated user.
 *
 *     ResetPasswordRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address to send the password reset email.
 *
 *     ResetPassword:
 *       type: object
 *       properties:
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           description: The new password (must be at least 8 characters long and contain at least one letter and one special character).
 *
 *     ValidateResetToken:
 *       type: object
 *       properties:
 *         resetToken:
 *           type: string
 *           description: The password reset token to validate.
 */

module.exports = authRouter;
