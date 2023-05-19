const jwt = require('jsonwebtoken');
const envVars = require('../configs/env');
const User = require('../models/User');
const Responser = require('../utils/responser');

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      let responser = new Responser(401, 'Authentication failed: No token provided');
      return responser.respond(res);
    }
    const decodedToken = jwt.verify(token, envVars.jwtSecret);
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      let responser = new Responser(401, 'User Not Found:Invalid Token');
      return responser.respond(res);
    }
    let isEqual = user.userToken.token == token;
    let isExpired = user.userToken.tokenEXP <= new Date(Date.now());
    if (isEqual && !isExpired) {
      req.userId = user._id;
      next();
    } else {
      let responser = new Responser(401, 'Authentication failed: Invalid Or expired token ');
      return responser.respond(res);
    }
  } catch (error) {
    let responser = new Responser(401, 'Authentication failed: Invalid token');
    return responser.respond(res);
  }
}

module.exports = authMiddleware;
