//Check for logged in user
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};

exports.indexPage = async (req, res, next) => {
  res.render('index', { pageTitle: 'Home' });
};
