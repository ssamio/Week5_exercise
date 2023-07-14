var express = require('express');
const mongoose = require("mongoose");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoDB = process.env.MONGO_URL;
mongoose.connect(mongoDB);
mongoose.Promise = Promise;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error!"));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
