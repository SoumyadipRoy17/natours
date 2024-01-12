const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  console.log('Im here');
  const message = `Invalid ${err.path}: ${err.value} `;
  return new AppError(message, 400);
};

const handleDuplicatedFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

  const message = `Duplicate field ${value}. try another name`;
  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError('Invalid token Pleasse login again', 401);

const handleJWTExpiredError = (err) =>
  new AppError('Your Token has expired . Please login again', 401);

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    //Rendered Website
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    //Operational error that we know
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //Programming error or unknown error : dont leak error details
    else {
      //1) Log the error
      console.error('ERROR ', err);

      //2)Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  } else {
    //Operational error that we know
    if (err.isOperational) {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
      });
    }
    //Programming error or unknown error : dont leak error details
    else {
      //1) Log the error
      console.error('ERROR ', err);

      //2)Send generic message
      res.status(500).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later',
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('Error encountered in production');
    // let error = { ...err };

    if (err.name === 'CastError') {
      console.log('HandleCast Error');
      err = handleCastErrorDB(err);
    }
    if (err.name === 'MongoError') {
      console.log('Duplicate field error');
      err = handleDuplicatedFieldsDB(err);
    }
    if (err.name === 'JsonWebTokenError') err = handleJWTError(err);
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError(err);
    sendErrorProd(err, req, res);
  }
};
