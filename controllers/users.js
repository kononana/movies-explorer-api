const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = process.env;
const ConflictRequestError = require('../errors/NoRightsError');
const AuthorizationError = require('../errors/Unauthorized');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

// Cоздание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictRequestError(`Пользователь с таким ${email} уже существует`);
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          email,
          password: hash,
          name,
        }));
    })
    .then((user) => {
      res.status(200).send({ email: user.email, _id: user._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('неверный формат запроса'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new AuthorizationError('пользователь не зарегестрирован'));
    });
};

// получение текущего пользователя
module.exports.getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('неверный формат запроса'));
    }
    next(err);
  });

// обновление данных пользователя
module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('неверный формат запроса'));
      }
      if (err.code === 11000) {
        next(new ConflictRequestError(`Пользователь с таким email ${email} уже существует`));
      }
      next(err);
    });
};
