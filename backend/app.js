require('dotenv').config(); 

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const connectDB = require('./config/db');
connectDB();

const app = express(); 

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');


app.use("/login", authRoutes);
app.use(logger('dev'));
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
