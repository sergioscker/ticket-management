'use strict';

const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.js');

function authMiddleware(req, res, next) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authToken.split(' ');

  try {
    const decoded = jwt.verify(token, authConfig.secret);

    req.userId = decoded.id;

    console.log('Usuário autenticado:', {
      id: decoded.id,
      name: decoded.name,
    });

    return next();
  } catch (err) {
    console.error('Erro de autenticação:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
