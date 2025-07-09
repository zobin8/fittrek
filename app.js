require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var passport = require('passport');
var session = require('express-session')
var path = require('path');
const csurf = require('csurf');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var mongoose = require('mongoose');
var helmet = require('helmet');
var util = require('./src/util.js');

var defaultRouter = require('./routes/default');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var trekRouter = require('./routes/trek');

var app = express();
app.set('trust proxy', 1);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Database
mongoose.connect('mongodb://db/fittrek');

// Sessions
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({secret: process.env.SESSION_SECRET, cookie: {secure: true} }));

// Configure Passport
app.use(passport.initialize());
app.use(passport.session());

// Helmet
app.use(helmet());

// CSRF
var parseForm = bodyParser.urlencoded({ extended: false })
app.use(parseForm);
const csrfMiddleware = csurf({cookie: {secure: true, httpOnly: true, sameSite: 'strict'}});
app.use(csrfMiddleware);

// Globals Middleware
app.use(util.globals);

// Express
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routers
app.use('/', defaultRouter);
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/trek', trekRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.status = err.status || 500;

    // render the error page
  util.globals(req, res, () => {});
  res.locals.error = {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
