var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/users');
require('../src/passport');
var router = express.Router();

router.post('/google', passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/fitness.location.read'] }));

router.get('/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/failed' }));

router.post('/delete', async function(req, res, next) {
    if (req.user) {
        await User.deleteOne({openid: req.user.openid});
        req.logout();
        res.redirect('/');
    } else {
        res.redirect('/delete');
    }
});

router.post('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});


module.exports = router;
