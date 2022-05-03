const { generateError } = require('../helpers');
const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw generateError('Falta la cabecera', 404);
    }

    let token;
    try {
      token = jwt.verify(authorization, process.env.SECRET);
    } catch {
      throw generateError('Token Incorrecto', 401);
    }
    req.userId = token.id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authUser,
};
