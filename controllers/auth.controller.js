const { InternalError, NotFoundError } = require('../middlewares/errorhandler');
const logger = require('../middlewares/logger');
const { Cart } = require('../models/Cart');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const Responser = require('../utils/responser');
const { hashPassword } = require('../utils/utils');

const signup = async (req, res, next) => {
  try {
    const { fullname, email, password, phone } = req.body;
    let isEmailExists = await User.getUserByEmail(email);
    let isPhoneExists = await User.findOne({ phone });
    console.log({
      isEmailExists,
      isPhoneExists,
    });
    if (isEmailExists || isPhoneExists) {
      let responser = new Responser(403, 'Email or Phone not available');
      return responser.respond(res);
    }
    let newUser = new User({
      fullname,
      email,
      password: hashPassword(password),
      phone,
    });
    let user = await newUser.save();
    user.userToken.token = user.createToken();
    user.userToken.tokenEXP = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();
    let userWishlist = await Wishlist.createUserWishlist(user._id);
    let userCart = await Cart.createUserCart(user._id);
    let emailDetails = await user.sendVerifyEmail();
    logger.info({
      user,
      userWishlist,
      userCart,
      emailDetails,
    });
    let responser = new Responser(201, 'Signup Success', { token: user.userToken.token });
    return responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      let responser = new Responser(401, 'Wrong email or password!');
      return responser.respond(res);
    }
    let isMatch = user.comparePassword(password);
    if (!isMatch) {
      let responser = new Responser(401, 'Wrong email or password!');
      return responser.respond(res);
    }
    user.userToken.token = user.createToken();
    user.userToken.tokenEXP = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();
    let responser = new Responser(200, 'Login Success', { token: user.userToken.token });
    return responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

const verfiyEmail = async (req, res, next) => {
  try {
    const { token, uid } = req.query;
    const user = await User.findById(uid);
    if (!user) {
      let responser = new Responser(403, 'Invalid Verify Token');
      return responser.respond(res);
    }
    let isValidToken = user.validateVerifyCode(token);
    if (!isValidToken) {
      let responser = new Responser(403, 'Invalid Verify Token');
      return responser.respond(res);
    }
    user.emailVerify.isVerified = true;
    await user.save();
    let responser = new Responser(200, 'email verified you can close this page now');
    return responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

const sendVerifyEmail = async (req, res, next) => {
  try {
    let user = await User.findById(req.userId);
    if (!user) {
      let responser = new Responser(401, 'Authentication failed: Invalid token');
      return responser.respond(res);
    }
    await user.sendVerifyEmail();
    let responser = new Responser(200, 'Verify code sent to your email');
    return responser.respond(res);
  } catch (error) {
    if (error.message == 'already verified') return res.status(403).json({ message: error.message });
    else next(new InternalError('Internal error', error.message));
  }
};

const resetPasswordRequest = async (req, res, next) => {
  try {
    let user = await User.getUserByEmail(req.body.email);
    if (!user) {
      let responser = new Responser(403, 'Invalid email');
      return responser.respond(res);
    }
    await user.sendResetEmail();
    let responser = new Responser(200, 'Check your email for reset token it will expire in 24h');
    return responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    let { resetToken } = req.params;
    let { email, newPassword } = req.body;
    let user = await User.getUserByEmail(email);
    if (!user) {
      let responser = new Responser(403, 'Invalid email');
      return responser.respond(res);
    }
    let isValid = user.validateResetToken(resetToken);
    if (!isValid) {
      let responser = new Responser(403, 'Invalid Token');
      return responser.respond(res);
    }
    let reset = await user.resetPassword(newPassword);
    let responser = new Responser(403, reset);
    return responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

const validateResetToken = async (req, res, next) => {
  try {
    let { email, resetToken } = req.body;
    let user = await User.getUserByEmail(email);
    if (!user) {
      let responser = new Responser(403, 'Invalid email');
      return responser.respond(res);
    }
    let isValid = user.validateResetToken(resetToken);
    if (!isValid) {
      let responser = new Responser(403, 'Invalid Token');
      return responser.respond(res);
    }
    let responser = new Responser(200, 'Validation Success', { isValid });
    return responser.respond(res);
  } catch (error) {
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
