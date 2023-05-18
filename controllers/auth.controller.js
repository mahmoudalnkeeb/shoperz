const { InternalError, NotFoundError } = require('../middlewares/errorhandler');
const logger = require('../middlewares/logger');
const { Cart } = require('../models/Cart');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const { hashPassword } = require('../utils/utils');

const signup = async (req, res, next) => {
  try {
    const { fullname, email, password, phone } = req.body;
    let isEmailExists = await User.getUserByEmail(email);
    let isPhoneExists = await User.find({ phone });
    if (isEmailExists || isPhoneExists)
      return res.status(400).json({ message: 'invalid user data' });
    let newUser = new User({
      fullname,
      email,
      password: hashPassword(password),
      phone,
    });
    let user = await newUser.save();
    let userWishlist = await Wishlist.createUserWishlist(user._id);
    let userCart = await Cart.createUserCart(user._id);
    let emailDetails = await user.sendVerifyEmail();
    logger.info({
      user,
      userWishlist,
      userCart,
      emailDetails,
    });
    res.status(201).json({ message: `user ${user._id} created` });
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(401).json({ message: 'Wrong email or password!' });
    let isMatch = user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Wrong email or password!' });
    user.userToken.token = user.createToken();
    user.userToken.tokenEXP = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();
    res.status(200).json({
      message: 'logged in successfully',
      token: user.userToken.token,
    });
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

const verfiyEmail = async (req, res, next) => {
  try {
    const { token, uid } = req.query;
    const user = await User.findById(uid);
    if (!user) return next(new NotFoundError('User not found'));
    let isValidToken = user.validateVerifyCode(token);
    if (!isValidToken) return res.status(403).json({ message: 'invalid token' });
    user.emailVerify.isVerified = true;
    await user.save();
    res.status(200).send('email verified you can close this page now');
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

const sendVerifyEmail = async (req, res, next) => {
  try {
    let user = await User.findById(req.userId);
    if (!user) return next(new NotFoundError('User not found'));
    await user.sendVerifyEmail();
    res.status(200).json({ message: 'Verify code sent to your email' });
  } catch (error) {
    if (error.message == 'already verified')
      return res.status(403).json({ message: error.message });
    else next(new InternalError('Internal error', error.message));
  }
};
const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return next(new NotFoundError('User not found'));
    await user.changePassword(currentPassword, newPassword);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

const resetPasswordRequest = async (req, res, next) => {
  try {
    let user = await User.getUserByEmail(req.body.email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.sendResetEmail();
    res.status(200).json({ message: 'reset code sent to your email' });
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    let { resetToken } = req.params;
    let { email, newPassword } = req.body;
    let user = await User.getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.passwordReset.token != resetToken)
      return res.status(403).json({ message: 'invalid token' });
    let reset = await user.resetPassword(newPassword);
    res.status(200).json({ message: reset });
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

const validateResetToken = async (req, res, next) => {
  try {
    let { email, resetToken } = req.body;
    let user = await User.getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    let isValid = user.validateResetToken(resetToken);
    if (isValid) return res.status(403).json({ message: 'invalid token' });
    res.status(200).json({ message: 'valid token', isValid });
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

module.exports = {
  signup,
  login,
  verfiyEmail,
  changePassword,
  resetPasswordRequest,
  resetPassword,
  sendVerifyEmail,
  validateResetToken,
};
