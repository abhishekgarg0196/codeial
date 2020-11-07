const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
// used for session cookie
const session = require("express-session");
const passport = require("passport");
//This is just to initialze and notify express app that we are using passport middleware here
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const MongoStore = require("connect-mongo")(session);
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

// The scss should be pre compiled such that css file are availbale on start of application to the layout/template
//Put this at a positon just above the server starting
// and also before browser makes a req to fetch the page
app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended",
    // Prefix tell the app that by default to look for CSS file in which dir
    prefix: "/css",
  })
);

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static("./assets"));

//make the upload path available to the browser
app.use('/uploads', express.static(__dirname +"/uploads"));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//Mongo store is used to store the session cokkies in the db
// This is to tell what kind of cookies are being configured .. this will be used by passport for serialize and deserialize the user
app.use(
  session({
    name: "codeial",
    // TODO change the secret before deployment in production mode
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect mongo setup ok");
      }
    ),
  })
);

// this will call de-serialize in passport based on presence of cookies or not
app.use(passport.initialize());
//This is seesion which is created by passport
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// we need to put it after the session is used , because it needs session cookies
app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});

//By default, LocalStrategy expects to find credentials in parameters named username and password.
//If your site prefers to name these fields differently, options are available to change the defaults.
