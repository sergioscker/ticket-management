'use strict';

const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.js');

function authMiddleware(req, res, next) {
  const authToken = req.cookies.token;

  if (!authToken) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(authToken, authConfig.secret);

    req.userId = decoded.id; // Store the user ID in the request

    return next();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Token error:', err.message);
    }

    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
