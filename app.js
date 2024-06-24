require('dotenv').config();
var createError = require('http-errors');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var session = require('express-session');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'salchipapa',resave: false,saveUninitialized: true,}));
app.use(passport.initialize());
app.use(passport.session());



// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.email || user.username);
});

// Deserialize user
passport.deserializeUser((user, done) => {
    if (user === process.env.EMAIL) {
      done(null, { email: user });
    } else {
      done(null, { username: user });
    }

});


// Passport Local Strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    if (email === process.env.EMAIL && password === process.env.PASSWORD) {
      return done(null, { email });
    } else {
      return done(null, false, { message: 'Invalid credentials' });
    }
  }
));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "https://yendercv.onrender.com/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  return done(null, { username: profile.username });
}
));





app.use('/', indexRouter);
app.use('/users', usersRouter);

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
