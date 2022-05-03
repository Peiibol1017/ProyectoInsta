const bcrypt = require('bcrypt');
const { generateError } = require('../helpers');
const { getConnection } = require('./db');

const getUserByUsername = async (username) => {
  let connection;

  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `
  SELECT * FROM users WHERE username=?
  `,
      [username]
    );
    if (result.length === 0) {
      throw generateError('No existe el nombre de usuario', 404);
    }
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const getUserById = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `
  SELECT id, username, email, created_at FROM users WHERE id=?
  `,
      [id]
    );
    if (result.length === 0) {
      throw generateError('No hay ningún usuario con esa id', 404);
    }
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const createNewUser = async (username, email, password) => {
  let connection;
  try {
    connection = await getConnection();
    const [user] = await connection.query(
      `SELECT id FROM users WHERE username = ?`,
      [username]
    );
    const [mail] = await connection.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (user.length > 0 || mail.length > 0) {
      throw generateError('Ese nombre de usuario o email ya está en uso', 409);
    }
    const passwordCrypt = await bcrypt.hash(password, 8);

    const [newUser] = await connection.query(
      `
    INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, passwordCrypt]
    );
    return newUser.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createNewUser,
  getUserById,
  getUserByUsername,
};
