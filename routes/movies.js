const router = require('express').Router();
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');
const validation = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', validation.checkMovie, addMovie);
router.delete('/:_id', validation.checkMovieId, deleteMovie);

module.exports = router;
