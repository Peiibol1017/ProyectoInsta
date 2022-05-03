const { generateError } = require('../helpers');
const { getConnection } = require('./db');

const getSinglePost = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `
        SELECT * FROM posts WHERE id = ?`,
      [id]
    );
    if (result.length === 0) {
      throw generateError('el post no existe', 404);
    }
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};
const getPostsByUserId = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `
        SELECT * FROM posts WHERE user_id = ?`,
      [id]
    );
    if (result.length === 0) {
      throw generateError('el usuario no tiene posts o no existe', 404);
    }
    return result;
  } finally {
    if (connection) connection.release();
  }
};

const deletePost = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `
        DELETE FROM posts WHERE id = ?
        `,
      [id]
    );
    return;
  } finally {
    if (connection) connection.release();
  }
};

const getAllPosts = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [result] = await connection.query(`
SELECT * FROM posts order BY created_at DESC
`);
    return result;
  } finally {
    if (connection) connection.release();
  }
};

const createPost = async (userId, image, text = '', mess) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
    INSERT INTO posts (user_id, image, text, mess)
    VALUES(?,?,?,?)
    `,
      [userId, image, text, mess]
    );
    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

const setLikedPosts = async (userId, postId) => {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
         INSERT INTO liked (user_id, post_id)
         VALUES (?,?)
         `,
      [userId, postId]
    );
    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};
const getLikedPosts = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `
        SELECT * FROM liked INNER JOIN posts ON liked.post_id = posts.id WHERE liked.user_id= ?;
    `,
      [id]
    );
    if (result.length === 0) {
      throw generateError('el usuario no le gustan los posts o no existe', 404);
    }
    return result;
  } finally {
    if (connection) connection.release();
  }
};
const getSingleLikedPost = async (userId, postId) => {
  let connection;

  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `
        SELECT * FROM liked WHERE user_id = ? and post_id = ?`,
      [userId, postId]
    );
    if (result.length === 0) {
      throw generateError(
        'el post no se encuentra en la lista de me gusta',
        404
      );
    }
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};
const deleteLikedPost = async (userId, id) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `
        DELETE FROM liked WHERE user_id = ? and post_id = ?
        `,
      [userId, id]
    );
    return;
  } finally {
    if (connection) connection.release();
  }
};

const searchPosts = async (search) => {
  let connection;
  try{
    connection = await getConnection();
   const results = await connection.query(
     `
    SELECT * FROM posts WHERE text like ?
    `,
     [`%${search}%`]
   );
return results[0];
  } finally {
    if (connection) connection.release();
  }
};
module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
  getPostsByUserId,
  setLikedPosts,
  getLikedPosts,
  getSingleLikedPost,
  deleteLikedPost,
  searchPosts,
};
