const jwt = require('jsonwebtoken');
const envVars = require('../configs/env');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authentication failed: No token provided' });
    }

    const decodedToken = jwt.verify(token, envVars.jwtSecret);
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let isEqual = user.userToken.token == token;
    let isExpired = user.userToken.tokenEXP <= new Date(Date.now());
    if (isEqual && !isExpired) {
      req.userId = user._id;
      next();
    } else
      return res
        .status(401)
        .json({ message: 'Authentication failed: Invalid Or expired token ' });
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
}

module.exports = authMiddleware;
