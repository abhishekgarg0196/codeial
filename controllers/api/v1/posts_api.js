const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){
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
    return res.json(200, {
        message:"List of Posts",
        posts: posts
    })
}


module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
   // if (post.user == req.user.id) {
      post.remove();
     
      await Comment.deleteMany({ post: req.params.id });

      return res.json(200, {
          message:"Post and associated comments deleted successfully !"
      });
 
    // } else {
    //   req.flash("error", "you cannot delete this post");
    //   return res.redirect("back");
    // }
  } catch (err) {
    console.log(`error in creating a post : ${err}`);
    return res.json(500, {
        message:"Internal server Error"
    });
  }
};
