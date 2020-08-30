const Post = require('../models/post');

module.exports.home = function(req, res){
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

    //populate the user of each post
        Post.find({})
        .populate('user')
        // populate the comments in that post and the user of each of the comments
        .populate({
            path: 'comments',
            populate:{
                path:'user'
            }

        })
        .exec(function(err, posts){
            if(err){console.log(`Error occured while fetching the posts ${err}`);}
            return res.render('home', {
                title: "Codeial | Home",
                posts:  posts
            });
        })
}

// module.exports.actionName = function(req, res){}