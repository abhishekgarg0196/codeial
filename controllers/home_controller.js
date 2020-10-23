const Post = require("../models/post");
const User = require("../models/user");

// async declares that this function contains some aync statements
module.exports.home = async function (req, res) {
  // console.log(req.cookies);
  // res.cookie('user_id', 25);
  // Post.find({} , function(err, posts){
  //     if(err){
  //         console.log(`Error occured while fetching the posts ${err}`);
  //     }
  //     return res.render('home', {
  //         title: "Codeial | Home",
  //         posts: posts
  //     });
  // });

  // //populate the user of each post
  // // this is an example of callback hell
  //     Post.find({})
  //     .populate('user')
  //     // populate the comments in that post and the user of each of the comments
  //     .populate({
  //         path: 'comments',
  //         populate:{
  //             path:'user'
  //         }

  //     })
  //     .exec(function(err, posts){
  //         if(err){console.log(`Error occured while fetching the posts ${err}`);}
  //         User.find({}, function(err, users){
  //             return res.render('home', {
  //                 title: "Codeial | Home",
  //                 posts:  posts,
  //                 all_users: users
  //             });
  //         });
  //     })

  // using async + await
  try {
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      // populate the comments in that post and the user of each of the comments
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });

    let users = await User.find({});

    return res.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    console.log(`Error : ${err}`);
  }
};

// module.exports.actionName = function(req, res){}

//using then
// Post.find({}).populate('comments').then();

//using exec
//let posts =  Post.find({}).populate('comments').exec();
//posts.then();
