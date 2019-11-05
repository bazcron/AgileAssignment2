var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const statements = require("./routes/statements");
const users = require("./routes/users");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/users/:id', users.findUser);


app.get('/statements', statements.findAll);
app.get('/statements/:id', statements.findOne);
app.post('/statements',statements.addStatement);
app.put('/statements/:id/agree',statements.agreedWithStatement);
app.put('/statements/:id/disagree',statements.disagreeWithStatement);
app.delete('/statements/:id', statements.deleteStatement);

app.post('/users', users.addUser);
app.get('/users', users.findAllUsers);
app.delete('/users/:id', users.deleteUser);
app.put('/users/:id/agree',users.agreedWithStatement);
app.put('/users/:id/disagree',users.disagreeWithStatement);

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