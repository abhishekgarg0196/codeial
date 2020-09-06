const Comment = require('../models/comment');

const Post = require('../models/post');


module.exports.create = async function(req, res){
    // using async await
    try {
      let post = await  Post.findById(req.body.post);

        if(post){
            let comment = await Comment.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id    
                });
                post.comments.push(comment);
                post.save();

                res.redirect('/');
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

}


module.exports.destroy = async function(req, res){

    try {
        
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
                // pull is the same as in mongodb language
                //The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
                 let post =  await Post.findByIdAndUpdate(postId, { $pull : 
                { comments : req.params.id }});
                return res.redirect('back');
        }else{
            return res.redirect('back');
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
}
