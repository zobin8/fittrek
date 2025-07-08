require("dotenv").config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/users');
const fitdata = require('./fitdata');

passport.serializeUser(function(user, done) {
    done(null, user.openid);
});

passport.deserializeUser(async function(user, done) {
    return await User.findOne({openid: user})
    .then((user) => done(null, user))
    .catch(done);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
},
async function(accessToken, refreshToken, profile, done) {
    return await User.findOneAndUpdate(
        {openid: profile.id},
        {$set: {name: profile.displayName, token: accessToken}},
        {upsert: true, new: true})
    .then(async (user) => {
        await fitdata.sync(user);
        return done(null, user);
    })
    .catch(async (err) => {
        console.log(err)
        return done(err);
    });
}
));
