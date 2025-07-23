require("dotenv").config();
const passport = require('passport');
const FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
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

passport.use(new FitbitStrategy({
    clientID: process.env.FITBIT_CLIENT_ID,
    clientSecret: process.env.FITBIT_CLIENT_SECRET,
    callbackURL: process.env.FITBIT_CALLBACK,
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
