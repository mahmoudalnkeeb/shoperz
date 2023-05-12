const jwt = require('jsonwebtoken');
const envVars = require('../configs/env');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
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

    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
}

module.exports = authMiddleware;
