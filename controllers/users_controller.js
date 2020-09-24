const User = require("../models/user");

module.exports.profile = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    // we can not use the key user as it's already availbale inlocals
    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
    });
  });
};

module.exports.update = function (req, res) {
  if (req.user.id == req.params.id) {
    User.findByIdAndUpdate(
      req.params.id,
      {
        // or req.body
        name: req.body.name,
        email: req.body.email,
      },
      function (err, user) {
        return res.redirect("back");
      }
    );
  } else {
    res.status(401).send("Unauthorized");
  }
};

// render the sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.render("/user/profile");
  }
  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

// render the sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.render("/user/profile");
  }
  return res.render("user_sign_in", {
    title: "Codeial | Sign In",
  });
};

// get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user in signing up");
      return;
    }

    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in creating user while signing up");
          return;
        }

        return res.redirect("/users/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });
};

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash("success", "logged in successfully");
  // here we are redirecting to the home page and thus app m/w will be called and hence the res.locals.flash will be set accordingly
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  //This function is given to req by passport
  req.logout();
  req.flash("success", "you have logged out successfully");

  // before redirect to home page we need to log out
  return res.redirect("/");
};
