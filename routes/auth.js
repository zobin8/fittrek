var express = require('express');
var passport = require('passport');
var User = require('../models/users');
require('../src/passport');
var router = express.Router();

router.post('/fitbit', passport.authenticate('fitbit', { scope: ['profile', 'activity'] }));

router.get('/fitbit/callback', passport.authenticate('fitbit', { successRedirect: '/', failureRedirect: '/failed' }));

router.post('/delete', async function(req, res, next) {
    if (req.user) {
        await User.deleteOne({openid: req.user.openid});
        req.logout((err) => {
            if (err) { return next(err); };
            res.redirect('/');
        });
    } else {
        res.redirect('/delete');
    }
});

router.post('/logout', function(req, res, next) {
    req.logout((err) => {
        if (err) { return next(err); };
        res.redirect('/');
    });
});


module.exports = router;
