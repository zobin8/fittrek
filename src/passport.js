require("dotenv").config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/users');
const fitdata = require('./fitdata');

passport.serializeUser(function(user, done) {
    done(null, user.openid);
});

passport.deserializeUser(function(user, done) {
    User.findOne({openid: user}, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    passReqToCallback: true
},
function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({openid: profile.id}, {name: profile.displayName, token: accessToken}, async function (err, user) {
        await fitdata.sync(user);
        return done(err, user);
    });
}
));
