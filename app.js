const express = require('express');
const fileupload = require('express-fileupload');
const path = require('path');
const cors = require('cors');

const wordRouter = require('./routes/word.router');
const signinRouter = require('./routes/signin.router');
const userRouter = require('./routes/user.router');
const userTokenRouter = require('./routes/token.router');
const userWordsRouter = require('./routes/userWord.router');
const statisticRouter = require('./routes/statistic.router');
const checkAuthentication = require('./checkAuthentication');

const app = express();
app.use(express.json({ extended: true }));
app.use(
  fileupload({
    useTempFiles: true
  })
);

app.use(cors());

app.use('/files', express.static(path.join(__dirname, './files')));

app.use(checkAuthentication);

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/words', wordRouter);

app.use('/signin', signinRouter);

app.use('/users', userRouter);

userRouter.use('/:id/tokens', userTokenRouter);

userRouter.use('/:id/words', userWordsRouter);

userRouter.use('/:id/statistics', statisticRouter);

module.exports = app;
