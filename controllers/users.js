const { generateError } = require('../helpers');
const {
  createNewUser,
  getUserById,
  getUserByUsername,
} = require('../db/users');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const newUserController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const schema = Joi.object().keys({
      username: Joi.string().min(5).max(14).required(),
      email: Joi.string().trim().email().required(),
      password: Joi.string().min(5).max(10).required(),
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
      throw generateError(validation.error.message, 400);
    }

    const id = await createNewUser(username, email, password);

    console.log(req.body);

    res.send({
      status: 'ok',
      message: `Usuario creado con la Id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

const getUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw generateError('Debes rellenar ambos campos, 400');
    }

    const user = await getUserByUsername(username);

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      throw generateError('Contraseña incorrecta', 401);
    }

    const payload = { id: user.id };

    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '30d',
    });

    res.send({
      status: 'ok',
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newUserController,
  getUserController,
  loginController,
};
