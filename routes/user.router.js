const { changePassword } = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/authentication');
const reqValidator = require('../middlewares/validator');
const { changePasswordSchema } = require('../validators/authSchemas');

const userRouter = require('express').Router();

userRouter.put('/change-password', reqValidator(changePasswordSchema), authMiddleware, changePassword);

module.exports = userRouter;
