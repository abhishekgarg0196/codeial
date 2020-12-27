const Comment = require("../models/comment");

const Post = require("../models/post");
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require("../config/kue");

module.exports.create = async function (req, res) {
  // using async await
  try {
    let post = await Post.findById(req.body.post);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      post.comments.push(comment);
      post.save();

      comment = await comment.populate("user", "name email").execPopulate();
      //commentsMailer.newComment(comment);
      let job = queue.create('emails', comment).save(function (err) {
        if (err) { console.log(`Error in creating a queue : ${err}`); return; }
        console.log(`Job id enqueued ${job.id}`);
      })
      if (req.xhr) {
        // Similar for comments to fetch the user's id!

        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "comment created!",
        });
      }

      req.flash("success", "Comment published!");

      res.redirect("/");
    }
  } catch (err) {
    console.log(`Error ${err}`);
    return;
  }
  // Post.findById(req.body.post, function(err, post){
  //     if(post){
  //         Comment.create({
  //           content: req.body.content,
  //           post: req.body.post,
  //           user: req.user._id
  //         },function(err, comment){
  //             if(err){
  //                 // handle error
  //                 console.log(`Error occured while creating the comment ${err}`)
  //             }
  //             post.comments.push(comment);
  //             post.save();

  //             res.redirect('/');
  //         });
  //     }
  // });
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.user == req.user.id) {
      let postId = comment.post;
      comment.remove();
      // pull is the same as in mongodb language
      //The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
      let post = await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });
      // send the comment id which was deleted back to the views
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Comment deleted",
        });
      }
      req.flash("success", "Comment deleted!");
      return res.redirect("back");
    } else {
      req.flash("error", "Unauthorized");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(`Error ${err}`);
    return;
  }
  // Comment.findById(req.params.id, function(err, comment){
  //     if(comment.user == req.user.id){

  //         let postId = comment.post;

  //         comment.remove();
  //         // pull is the same as in mongodb language
  //         //The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
  //         Post.findByIdAndUpdate(postId, { $pull : { comments : req.params.id }}, function(err, post){
  //             return res.redirect('back');
  //         })
  //     } else {
  //         return res.redirect('back');
  //     }

  // })
};
