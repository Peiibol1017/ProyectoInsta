const { generateError, createPathIfNotExists } = require('../helpers');
const {
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
} = require('../db/posts');
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');

const newPostController = async (req, res, next) => {
  try {
    let imageFileName;
    if (!req.files || !req.files.image) {
      throw generateError('La imagen es obligatoria', 403);
    }
    if (req.files && req.files.image) {
      const uploadsDir = path.join(__dirname, '../uploads');

      console.log(uploadsDir);

      await createPathIfNotExists(uploadsDir);

      const image = sharp(req.files.image.data);

      image.resize(1000);

      imageFileName = `${nanoid(24)}.jpg`;
      image.toFile(path.join(uploadsDir, imageFileName));
    }

    const { text } = req.body;

    if (text.length > 100 || text.length === 0) {
      throw generateError(
        'El texto descriptivo debe existir y no debe superar 100 caracteres',
        400
      );
    }
    const { mess } = req.body;
    const id = await createPost(req.userId, imageFileName, text, mess);

    res.send({
      status: 'ok',
      message: `Post de id: ${id} subido`,
    });
  } catch (error) {
    next(error);
  }
};

const getPostsController = async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.send({
      status: 'ok',
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

const getPostsByUserIdController = async (req, res, next) => {
  try {
    console.log(req.params);
    const { id } = req.params;

    if (id === 0) {
      throw generateError('No existe el usuario con esta ID', 404);
    }
    const posts = await getPostsByUserId(id);

    res.send({
      status: 'ok',
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

const getOnePostController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await getSinglePost(id);

    res.send({
      status: 'ok',
      message: post,
    });
  } catch (error) {
    next(error);
  }
};

const deletePostController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await getSinglePost(id);

    if (req.userId !== post.user_id) {
      throw generateError('No tienes permisos para borrar este post', 403);
    }
    await deletePost(id);
    res.send({
      status: 'ok',
      message: `Post con id: ${id} borrado`,
    });
  } catch (error) {
    next(error);
  }
};

const setLikedPostsController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw generateError(`No existe ningun post con la id: ${id}`, 404);
    }
    await setLikedPosts(req.userId, id);
    res.send({
      status: 'ok',
      message: `El post con id: ${id} te ha gustado`,
    });
  } catch (error) {
    next(error);
  }
};

const getLikedPostsController = async (req, res, next) => {
  try {
    const id = req.userId;

    if (id === 0) {
      throw generateError('No existe el usuario con esta ID', 404);
    }
    const posts = await getLikedPosts(id);
    res.send({
      status: 'ok',
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLikedPostsController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await getSingleLikedPost(req.userId, id);
    if (req.userId !== post.user_id) {
      throw generateError(
        'No tienes permisos para quitar de me gusta este post',
        403
      );
    }
    await deleteLikedPost(req.userId, id);
    res.send({
      status: 'ok',
      message: `Post con id: ${id} borrado de la lista de me gusta`,
    });
  } catch (error) {
    next(error);
  }
};

const searchPostsController = async (req, res, next) => {
  try{
    const {text} = req.query;
    if (text === 0) {
      throw generateError ('El campo search está vacío', 404);
    }
    const results = await searchPosts (text);

        res.send({
      status: 'ok',
      data: results,
  });
} catch (error) {
  next (error);
}};
module.exports = {
  getOnePostController,
  newPostController,
  getPostsController,
  deletePostController,
  getPostsByUserIdController,
  setLikedPostsController,
  getLikedPostsController,
  deleteLikedPostsController,
  searchPostsController,
};
