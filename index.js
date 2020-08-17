const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
//This is just to initialze and notify express app that we are using passport middleware here
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//Mongo store is used to store the session cokkies in the db
// This is to tell what kind of cookies are being configured .. this will be used by passport for serialize and deserialize the user
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store : new MongoStore(
        {
        mongooseConnection: db,
        autoRemove:'disabled'
        },
        function(err){
            console.log(err || 'connect mongo setup ok');
        }
    )
}));

// this will call de-serialize in passport based on presence of cookies or not 
app.use(passport.initialize());
//This is seesion which is created by passport
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// use express router
app.use('/', require('./routes'));


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});


//By default, LocalStrategy expects to find credentials in parameters named username and password. 
//If your site prefers to name these fields differently, options are available to change the defaults.