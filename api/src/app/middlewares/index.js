'use strict';

const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.js');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if the token was provided
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Extract the token from the 'Bearer <token>' format
  const [, token] = authHeader.split(' ');

  try {
    // Verify the token using the JWT secret
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        throw new Error('Token is invalid');
      }
      // Attach the user's ID and name from the decoded token to the request
      req.userId = decoded.id;
      req.userName = decoded.name;

      return next();
    });
  } catch (err) {
    return res.status(401).json({ error: 'Token is invalid' });
  }
}

module.exports = authMiddleware;
