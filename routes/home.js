const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', function (req, res) {
  res.render('index', { pageTitle: 'Home' });
});

router.get('/dashboard', function (req, res) {
  if (req.session.user && req.cookies.user_sid) {
    models.post
      .findAll({
        order: [['createdAt', 'DESC']],
        where: {
          userUserId: req.session.user.user_id,
        },
        include: [models.user],
      })
      .then(function (posts) {
        res.render('admin/dashboard', { posts: posts });
      });
  } else {
    res.redirect('/user/login');
  }
});
module.exports = router;
