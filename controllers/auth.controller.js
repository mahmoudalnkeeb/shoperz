const logger = require('../middlewares/logger');
const User = require('../models/User');

const signup = async (req, res, next) => {
  try {
    const { fullname, email, password, phone } = req.body;
    let user = await User.create({ fullname, email, password, phone });
    logger.info(user._id);
    user.sendVerifyEmail((info) => {
      logger.info(info);
    });
    await user.save();
    let userWishlist = await user.createWishlist();
    logger.info({
      user,
      userWishlist,
    });
    res.status(201).json({ message: `user ${user._id} created` });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(401).json({ message: 'Wrong email or password!' });
    user.comparePassword(password, (err, isMatch) => {
      if (err) console.log(err);
      if (!isMatch) return res.status(401).json({ message: 'Wrong email or password!' });
      else
        res.status(200).json({
          message: 'logged in successfully',
          token: user.createToken(),
        });
    });
  } catch (error) {
    next(error);
  }
};

const verfiyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const user = await User.findOneAndUpdate(
      { verifyCode: token },
      { emailVerified: true },
      { new: true }
    );
    if (!user.emailVerified) return res.status(400).json({ message: 'invalid token' });
    else {
      await user.save();
      res.status(200).send('email verified you can close this page now');
    }
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.changePassword(currentPassword, newPassword);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password' });
  }
};

module.exports = {
  signup,
  login,
  verfiyEmail,
  changePassword,
};
