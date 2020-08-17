const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


// Passport in the main index is the same instance we have in this class such that it could utilize the same intance and remain interconnected
// need to understand the the workflow

// authentication using passport
// Telling passport to use this local strategy
passport.use(new LocalStrategy({
    // By default, LocalStrategy expects to find credentials in parameters named username and password. If your site prefers to name these fields differently, options are available to change the defaults.
    // usernameFiled is key which get's from the form data as as name we pass it such that value is picked from that 
    // email in callback is just for more descriptive
        usernameField: 'email'
    },
    function(email, password, done){
        // find a user and establish the identity
        User.findOne({email: email}, function(err, user)  {
            if (err){
                console.log('Error in finding user --> Passport');
                return done(err);
            }

            if (!user || user.password != password){
                console.log('Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    // after marking it done it will use express-session to create session and encrypt 
    // express session will create a encrypted session , passport will call it internally and in index.js we have only mentioned the sessoion 
    // configuration
    done(null, user.id);
});



// deserializing the user from the key in the cookies
// After doing deseralize the user we need to create check authenticate method for chekcing whether user is being set of not 
// after wards we can call the checkauthenticate on profile page.. to check the user is valid or not 
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});

//check if user is authenticated
passport.checkAutheticated = function(req, res, next){
    // if the user is signed in, then pass on the request to the next 
    // function controller's action 
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('users/sign-in');
}

passport.setAuthenticatesUser = function(req, res, next){
    if(req.isAuthenticated()){
        //req. user contains the current signed in user form the seesion cookies and we just 
        // sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}



module.exports = passport;