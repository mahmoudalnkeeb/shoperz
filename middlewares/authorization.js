const User = require('../models/User');
const Responser = require('../utils/responser');

const authorize = (role) => {
  return async (req, res, next) => {
    let user = await User.findById(req.userId);
    if (user.role != role) {
      let responser = new Responser(401, 'you are not authorized to do this action');
      return responser.respond(res);
    }
    next();
  };
};

module.exports = authorize;
