const router = require('express').Router();
const passport = require('passport');

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);


router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.json(null);
  }
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});


module.exports = router;
