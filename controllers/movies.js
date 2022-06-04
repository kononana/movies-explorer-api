const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Movie = require('../models/movie');

// запрос списка фильмов
module.exports.getMovies = (req, res, next) => Movie.find({})
  .then((movie) => res.send(movie))
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError('проверьте введенные данные');
    }
    next(err);
  });

// добавление фильма
module.exports.addMovie = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError('проверьте введенные данные');
      }
      return res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('проверьте введенные данные'));
      }
      next(err);
    });
};

// удаление фильма
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (String(movie.owner) !== String(req.user._id)) {
        throw new ForbiddenError('Нет прав на удаление фильма');
      }
      // console.log(req.params._id);
      return Movie.findByIdAndRemove(req.params._id);
    })
    .then((movie) => res.send(movie))
    .catch(next);
};
