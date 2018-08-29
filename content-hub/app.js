const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const postsRouter = require('./postsRouter');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../learning-site-ui/build')));

app.use('/posts', postsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  message = err.message;
  error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ message, error });
});

module.exports = app;
