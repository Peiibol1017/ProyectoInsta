require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

const {
  newUserController,
  getUserController,
  loginController,
} = require('./controllers/users');

const {
  getOnePostController,
  newPostController,
  getPostsController,
  deletePostController,
  getPostsByUserIdController,
  setLikedPostsController,
  getLikedPostsController,
  deleteLikedPostsController,
  searchPostsController,
} = require('./controllers/posts');

const { authUser } = require('./middlewares/authorization');

const app = express();

app.use(express.json());
app.use(fileUpload());
app.use(morgan('dev'));
app.use('/uploads', express.static('./uploads'));

// RUTAS
app.post('/user', newUserController);
app.get('/user/:id', getUserController);
app.post('/login', loginController);

app.get('/', getPostsController);
app.get('/search', searchPostsController);
app.post('/', authUser, newPostController);
app.get('/post/:id', getOnePostController);
app.get('/user/:id/posts', getPostsByUserIdController);
app.delete('/post/:id', authUser, deletePostController);
app.post('/post/:id/liked', authUser, setLikedPostsController);
app.get('/liked/user', authUser, getLikedPostsController);
app.delete('/post/:id/liked', authUser, deleteLikedPostsController);

// 404
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'not found',
  });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

app.listen(3000, () => {
  console.log('servidor funcionando! ');
});
