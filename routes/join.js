const router = require('express').Router();
const routerUser = require('./users');

const routerMovies = require('./movies');
const auth = require('../middlewares/auth');
const ErrorNotFound = require('../errors/NotFoundError');
const validation = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');

router.post('/signin', validation.checkLogin, login);
router.post('/signup', validation.checkUserCreation, createUser);

router.use(auth);

router.use('/users', routerUser);
router.use('/movies', routerMovies);

router.use((req, res, next) => {
  next(new ErrorNotFound('страница не найдена'));
});

module.exports = router;
