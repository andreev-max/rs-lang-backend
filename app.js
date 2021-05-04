require('express-async-errors');
const express = require('express');
const fileupload = require('express-fileupload');
const createError = require('http-errors');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
require('express-async-errors');
const { NOT_FOUND } = require('http-status-codes');

const winston = require('./src/common/logging');
const wordRouter = require('./src/resources/words/word.router');
const signinRouter = require('./src/resources/authentication/signin.router');
const userRouter = require('./src/resources/users/user.router');
const userTokenRouter = require('./src/resources/token/token.router');
const userWordsRouter = require('./src/resources/userWords/userWord.router');
const aggregatedWordsRouter = require('./src/resources/aggregatedWords/aggregatedWord.router');
const statisticRouter = require('./src/resources/statistics/statistic.router');
const errorHandler = require('./src/errors/errorHandler');
const checkAuthentication = require('./src/resources/authentication/checkAuthentication');

const app = express();
app.use(express.json({ extended: true }));
app.use(
  fileupload({
    useTempFiles: true
  })
);

app.use(helmet());
app.use(cors());

app.use('/files', express.static(path.join(__dirname, '../files')));

app.use(checkAuthentication);

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use(
  morgan(
    ':method :status :url :userId size req :req[content-length] res :res[content-length] - :response-time ms',
    {
      stream: winston.stream
    }
  )
);

app.use('/words', wordRouter);

app.use('/signin', signinRouter);

app.use('/users', userRouter);

userRouter.use('/:id/tokens', userTokenRouter);

userRouter.use('/:id/words', userWordsRouter);

userRouter.use('/:id/aggregatedWords', aggregatedWordsRouter);

userRouter.use('/:id/statistics', statisticRouter);

app.use((req, res, next) => next(createError(NOT_FOUND)));

app.use(errorHandler);

module.exports = app;
