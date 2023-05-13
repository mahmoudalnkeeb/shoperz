const User = require('../models/User');

const authorize = (role) => {
  return async (req, res, next) => {
    let user = await User.findById(req.userId);
    if (user.role != role)
      return res
        .status(401)
        .json({ message: 'you are not authorized to do this action' });
    next();
  };
};

module.exports = authorize;
