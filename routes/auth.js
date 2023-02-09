const express = require('express');
const router = express.Router();
const models = require('../models');

//Check for logged in user
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};

// Sign up
router.get('/signup', sessionChecker, function (req, res) {
  let message = {
    errors: [],
  };
  res.render('signup', { message, pageTitle: 'signup' });
});

router.post('/signup', sessionChecker, (req, res) => {
  //Validate password length
  if (req.body.password.length < 8) {
    res.status(400);
    var message = {
      text: 'Please, enter a password with at least 8 characters.',
      errors: [],
    };
    res.render('signup', { message, pageTitle: 'signup' });
    return;
  }
  //Check if passwords match
  if (req.body.password !== req.body.password2) {
    res.status(400);
    var message = {
      text2: "Passwords don't match!",
      errors: [],
    };
    res.render('signup', { message, pageTitle: 'signup' });
    return;
  }
  console.log(req.body.name);
  models.user
    .create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
    .then((user) => {
      console.log(user);
      req.session.user = user.dataValues;
      res.redirect('/dashboard', { pageTitle: 'Dashboard' });
    })
    .catch((error) => {
      console.log('errr ');

      var message = {
        errors: error.errors,
      };
      res.render('signup', { message, pageTitle: 'signup' });
    });
});

//! Login

router.get('/login', function (req, res) {
  res.render('login', { pageTitle: 'Login' });
});
router.post('/login', sessionChecker, function (req, res) {
  var username = req.body.name;
  var password = req.body.password;

  models.user
    .findOne({
      where: { name: username },
    })
    .then(function (user) {
      if (!user) {
        res.redirect('/user/login');
      } else if (!user.validPassword(password)) {
        res.redirect('/user/login');
      } else {
        req.session.user = user.dataValues;
        res.redirect('/dashboard');
      }
    });
});

//Logout
router.get('/logout', function (req, res) {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.redirect('/');
  } else {
    res.redirect('/user/login');
  }
});

module.exports = router;
