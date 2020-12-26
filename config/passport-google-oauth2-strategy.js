const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// Tell passport to use a new strategy for google-login
passport.use(new googleStrategy({
    clientID: "396096146196-o88tsa5k9ladrdrvt0jrf7ulou8ghieo.apps.googleusercontent.com",
    clientSecret: "jb3z0vUuw9qWJTnZGpPZQkED",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) { // google generates the access token and gives to us, 
        //if access token expires then we will use refresh token to generate new access token
        // find a user
        User.findOne({
            email: profile.emails[0].value
        }).exec(function (err, user) {
            if (err) { console.log(`Error in google strategy-passport : ${err}`); return; }
            //console.log(profile);
            //console.log(accessToken);
            if (user) {
                // if found set the user as req.user 
                return done(null, user);
            } else {
                // if not found create the user and set is as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function (err, user) {
                    if (err) { console.log(`Error in creating user : ${err}`); return; }
                    return done(null, user);
                }

                )
            }
        });
    }
));

module.exports = passport;