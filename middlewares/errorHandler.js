const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;

  res.status(status).send({
    message: status === 500 ? 'На сервере произошла ошибка' : err.message,
  });
  next();
};

module.exports = errorHandler;
