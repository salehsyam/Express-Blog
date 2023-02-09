const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const colors = require('colors');
const morgan = require('morgan');
const app = express();

// Route files
const HomeRoute = require('./routes/home');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');

// view engine setup
app.engine('.html', require('ejs').__express);
// Optional since express defaults to CWD/views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

//Initialize Express Session
app.use(
  session({
    key: 'user_sid',
    secret: 'slayer',
    resave: false,
    saveUnitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

//Middleware to check if the user's cookie is still saved in the browser
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

//Check for logged in user
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};

app.use(function (req, res, next) {
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
});

// Mount routers
app.use('/', HomeRoute);
app.use('/user', authRoute);
app.use('post', postRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//start server
async function main() {
  const port = process.env.PORT || 3000;

  const server = app.listen(port, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow
        .bold
    );
  });
}

main();
