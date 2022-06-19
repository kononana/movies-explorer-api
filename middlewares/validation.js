const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const checkUrl = Joi.string().custom((value, helper) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helper.message('Неверный формат url');
});

const checkEmail = Joi.string().required().email();

const checkUserCreation = celebrate({
  body: Joi.object().keys({
    email: checkEmail,
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const checkLogin = celebrate({
  body: Joi.object().keys({
    email: checkEmail,
    password: Joi.string().required(),
  }),
});

const checkUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const checkMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: checkUrl,
    trailerLink: checkUrl,
    thumbnail: checkUrl,
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
});

const checkMovieId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});

const checkUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  checkUserCreation,
  checkUserInfo,
  checkMovie,
  checkMovieId,
  checkUserId,
  checkLogin,
};
