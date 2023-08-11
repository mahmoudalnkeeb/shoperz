const { response, request } = require('express');
const User = require('../models/User');
const Responser = require('../utils/responser');

/**
 *
 * @param {'USER' |'ADMIN' | 'MODERATOR'} role
 * @returns {(req:request , res:response , next) =>{}}
 */
const authorize = (role) => {
  return async (req, res, next) => {
    let user = await User.findById(req.userId);
    if (user.role != role) {
      let responser = new Responser(401, 'you are not authorized to do this action');
      return responser.respond(res);
    } else if (user.role == 'MODERATOR') return next();
    next();
  };
};

module.exports = authorize;
