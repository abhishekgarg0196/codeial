const User = require("../models/user");
const path = require('path');
const fs = require('fs');


module.exports.profile = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    // we can not use the key user as it's already availbale inlocals
    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
    });
  });
};

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      // Because it's an multipart form, the normal parser will not be able to parse it
      // so we won't be able to access it directly from req params
      // Thus to parse the body we are using multer and uploadAvatar middleware function
      
      User.uploadedAvatar(req, res , function(err){
        // the process provides req, multer will parse the req,  Multer adds a body object and a file or files object to the request object
        // And uploadAvaatr will upload it to the dest folder
        if(err){console.log("*** Multer Error : ", err)}
        user.name = req.body.name; // we can only read body of multipart form using multer and not being possible with normal parser
        user.email = req.body.email;
        if(req.file){
          if(user.avatar){
            let avatarStoragePath = path.join(__dirname , '..' , user.avatar);
            try {
                  if (fs.existsSync(avatarStoragePath)) {
                      fs.unlinkSync(avatarStoragePath);
                  }
                } catch(err) {
                  console.error(err)
                }
          }
          // log req.file to check that multer had processed the request.
          // this is saving the path of the uploaded file into the avatar field in the user
          user.avatar = User.avatarPath + "\\" + req.file.filename; // for windows use "\\" and for linux use "/"
        }
        user.save();
        return res.redirect('back');
      });
    } catch (error) {
        req.flash("error", err);
        return res.redirect("back");
    }
  }else{
    res.flash('error', 'Unauthorized')
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
  //NOTE:  req.flash() method will put the flash message in the cookie not in the request
  // res.redirect will not send the same req, res.redirect will just take us to another redirected url
  //so we dont have to do anything with req here, on the redirected url
  // it will chck the message in cookie and destroy that message after one time use
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  //This function is given to req by passport
  req.logout();
  req.flash("success", "you have logged out successfully");

  // before redirect to home page we need to log out
  return res.redirect("/");
};
