var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

require('dotenv/config');

var app = express();

app.set("k", "ssimpleloginn")

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PUT');
  next();
});
app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-access-token');
  res.send(200);
});

app.use('/', indexRouter);
app.use('/user', userRouter);

function validateUser(req, res, next) {
  jwt.verify(req.headers["x-access-token"], req.app.get("k"), function (err, decoded) {
    if (err) {
      if (err.name == "TokenExpiredError") {
        res.json({message: "Su cuenta expiró, vuelva a iniciar sesión."})
      } else if (err.name == "JsonWebTokenError") {
        res.json({message: "Token valido requerido."})
      } else {
        res.json({message: "Error en la autenticación."})
      }
    } else {
      req.body.tokenData = decoded;
      next();
    }
  })
}

app.validateUser = validateUser;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
