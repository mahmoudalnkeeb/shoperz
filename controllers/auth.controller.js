const { InternalError, NotFoundError } = require('../middlewares/errorhandler');
const logger = require('../middlewares/logger');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const Responser = require('../utils/responser');
const { hashPassword } = require('../utils/utils');

const signup = async (req, res, next) => {
  try {
    const { fullname, email, password, phone } = req.body;
    let isEmailExists = await User.findOne({ email });
    let isPhoneExists = await User.findOne({ phone });
    if (isEmailExists || isPhoneExists) {
      let responser = new Responser(
        400,
        'Worng Email or Phone please use anther email or phone ',
        null,
        'Error , wrong email or phone'
      );
      return responser.respond(res);
    }
    let newUser = new User({
      fullname,
      email,
      password: hashPassword(password),
      phone,
    });
    let user = await newUser.save();
    let token = user.createNewToken(user._id);
    let tokenEXP = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.userToken.token = token;
    user.userToken.tokenEXP = tokenEXP;
    let userWishlist = await Wishlist.createUserWishlist(user._id);
    let userCart = await Cart.createUserCart(user._id);
    let emailDetails = await user.sendVerifyEmail();
    logger.info({
      user_id: user._id,
      userWishlist,
      userCart,
      emailDetails,
    });
    let responser = new Responser(
      201,
      'A new account has been successfully registered for you at Shopers, please check your email to activate it',
      { token }
    );
    return responser.respond(res);
  } catch (error) {
    logger.error(error);
    next(new InternalError('Internal error', error.message));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      let responser = new Responser(404, 'Wrong email or password!', null, 'Error , This user is not exists');
      return responser.respond(res);
    }
    let isMatchedPassword = user.comparePassword(password);
    if (!isMatchedPassword) {
      let responser = new Responser(
        401,
        'Wrong email or password!',
        null,
        'Error , Unauthorized user informations'
      );
      return responser.respond(res);
    }
    let token = user.createNewToken();
    let tokenEXP = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.userToken.token = token;
    user.userToken.tokenEXP = tokenEXP;
    await user.save();
    let responser = new Responser(200, 'You have been successfully logged in to your account at shoperz', {
      token,
    });
    return responser.respond(res);
  } catch (error) {
    logger.error(error);
    next(new InternalError('Internal error', error.message));
  }
};

const verfiyEmail = async (req, res, next) => {
  try {
    const { token, uid } = req.query;
    const user = await User.findById(uid);
    if (!user) {
      let responser = new Responser(403, 'Invalid Verify Token', null, 'validation_error');
      return responser.respond(res);
    }
    let isValidToken = user.validateVerifyCode(token);
    if (!isValidToken) {
      let responser = new Responser(403, 'Invalid Verify Token', null, 'validation_error');
      return responser.respond(res);
    }
    user.emailVerify.isVerified = true;
    await user.save();
    let responser = new Responser(200, 'email verified you can close this page now');
    return responser.respond(res);
  } catch (error) {
    logger.error(error);
    next(new InternalError('Internal error', error.message));
  }
};

const sendVerifyEmail = async (req, res, next) => {
  try {
    let user = await User.findById(req.userId);
    if (!user) {
      let responser = new Responser(
        401,
        'Authentication failed: Invalid token',
        null,
        'authentication_error'
      );
      return responser.respond(res);
    }
    await user.sendVerifyEmail();
    let responser = new Responser(200, 'Verify code sent to your email');
    return responser.respond(res);
  } catch (error) {
    logger.error(error);
    if (error.message == 'already verified') return res.status(403).json({ message: error.message });
    else next(new InternalError('Internal error', error.message));
  }
};

const resetPasswordRequest = async (req, res, next) => {
  try {
    let user = await User.getUserByEmail(req.body.email);
    if (!user) {
      let responser = new Responser(403, 'Invalid email', null, 'validation_error');
      return responser.respond(res);
    }
    await user.sendResetEmail();
    let responser = new Responser(200, 'Check your email for reset token it will expire in 24h');
    return responser.respond(res);
  } catch (error) {
    logger.error(error);
    next(new InternalError('Internal error', error.message));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    let { resetToken } = req.params;
    let { email, newPassword } = req.body;
    let user = await User.getUserByEmail(email);
    if (!user) {
      let responser = new Responser(403, 'Invalid email', null, 'validation_error', null, 'validation_error');
      return responser.respond(res);
    }
    let isValid = user.validateResetToken(resetToken);
    if (!isValid) {
      let responser = new Responser(403, 'Invalid Token', null, 'validation_error', null, 'validation_error');
      return responser.respond(res);
    }
    let reset = await user.resetPassword(newPassword);
    let responser = new Responser(403, reset);
    return responser.respond(res);
  } catch (error) {
    logger.error(error);
    next(new InternalError('Internal error', error.message));
  }
};

const validateResetToken = async (req, res, next) => {
  try {
    let { email, resetToken } = req.body;
    let user = await User.getUserByEmail(email);
    if (!user) {
      let responser = new Responser(403, 'Invalid email', null, 'validation_error');
      return responser.respond(res);
    }
    let isValid = user.validateResetToken(resetToken);
    if (!isValid) {
      let responser = new Responser(403, 'Invalid Token', null, 'validation_error');
      return responser.respond(res);
    }
    let responser = new Responser(200, 'Validation Success', { isValid });
    return responser.respond(res);
  } catch (error) {
    logger.error(error);
    next(new InternalError('Internal error', error.message));
  }
};

module.exports = {
  signup,
  login,
  verfiyEmail,
  resetPasswordRequest,
  resetPassword,
  sendVerifyEmail,
  validateResetToken,
};
