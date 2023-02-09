const express = require('express');
const router = express.Router();
const models = require('../models');

//Post page
router.get('/:post_id', function (req, res) {
  var post_id = req.params.post_id;
  models.post
    .findOne({
      where: {
        post_id: post_id,
      },
      include: [models.user, models.comment],
    })
    .then(function (post) {
      res.render('post', { post });
    });
});

//Create Comment
router.post('/:post_id/comments', function (req, res) {
  models.comment
    .create({
      comment_author: req.body.comment_author,
      guest_email: req.body.guest_email,
      comment_body: req.body.comment,
      postPostId: req.params.post_id,
    })
    .then(function (comment) {
      comment.save();
      res.redirect('back');
    });
});

//Create post
router.get('/create', function (req, res) {
  var user = req.session.user;

  if (user === undefined) {
    res.redirect('/user/login');
  } else {
    res.render('admin/create');
  }
});

router.post('/create', function (req, res) {
  models.post
    .create({
      title: req.body.addTitle,
      post: req.body.addPost,
      userUserId: req.session.user.user_id,
    })
    .then(function (posts) {
      posts.save();
      res.redirect('/');
    });
});

//Edit Single post
router.get('/single-post/:post_id', function (req, res) {
  var user = req.session.user;

  if (user === undefined) {
    res.redirect('/user/login');
  } else {
    var post_id = req.params.post_id;
    models.post
      .findOne({
        where: {
          post_id: post_id,
        },
      })
      .then(function (post) {
        res.render('single-post', { post });
      });
  }
});

//Edit post
router.get('/edit/:post_id', function (req, res) {
  var user = req.session.user;

  if (user === undefined) {
    res.redirect('/user/login');
  } else {
    var post_id = req.params.post_id;
    models.post
      .findOne({
        where: {
          post_id: post_id,
        },
      })
      .then(function (post) {
        res.render('admin/edit', { post });
      });
  }
});

//Update post
router.post('/edit/:post_id', function (req, res) {
  var post_id = req.params.post_id;
  models.post
    .findOne({
      where: {
        post_id: post_id,
      },
    })
    .then(function (post) {
      post.title = req.body.updateTitle;
      post.post = req.body.updatePost;

      post.save().then(function () {
        res.render('single-post', { post });
      });
    })
    .catch(function (error) {
      if (error) {
        console.log(error);
        throw error;
      }
    });
});

// Delete post
router.get('/delete/:post_id', function (req, res) {
  var post_id = req.params.post_id;
  console.log('deletando post id' + post_id);
  models.post
    .destroy({
      where: {
        post_id: post_id,
      },
    })
    .then(function () {
      res.redirect('/dashboard');
    });
});

module.exports = router;
