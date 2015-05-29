var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//\\ new code to enable access to mongodb using "monk"
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/node-express-mongo');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();  //\\ this instantiates express and assigns "app" to it

// view engine setup - //\\ tells app where to find views, and which engine to use to render them
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));  //\\ tells app to make all 'public' resources appear from http://localhost:3000/[folder]

//\\ this makes our db accessible to the route (and needs to be "above" the following app.use routing
//\\ this always adds a database object to every request that the client sends... which is not very efficient!
app.use(function(req,res,next) {
  req.db = db;
  next();
});

//\\ this is the directive describing the routes to be used  and "establishing middleware for express"
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
