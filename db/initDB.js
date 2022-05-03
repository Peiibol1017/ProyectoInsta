require('dotenv').config();

const { getConnection } = require('./db');
async function main() {
  let connection;
  try {
    connection = await getConnection();
    console.log('borrando tablas existentes');
    await connection.query('DROP TABLE IF EXISTS liked');
    await connection.query('DROP TABLE IF EXISTS posts');
    await connection.query('DROP TABLE IF EXISTS users');
    console.log('creando tablas');
    await connection.query(`
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);
    await connection.query(`
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    image VARCHAR(100) NOT NULL,
    text VARCHAR(100) NOT NULL FULLTEXT,
    mess VARCHAR (250),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`);
    await connection.query(`
      CREATE TABLE Liked (
        id INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES posts(id)
    )
    `);
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();

    process.exit();
  }
}
main();
