const { InternalError } = require('../middlewares/errorhandler');
const User = require('../models/User');
const Responser = require('../utils/responser');

const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      let responser = new Responser(401, 'Authentication failed: Invalid token' ,  null, 'authentication_error');
      return responser.respond(res);
    }
    await user.changePassword(currentPassword, newPassword);
    let responser = new Responser(200, 'Password changed successfully');
    return responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

module.exports = { changePassword };
