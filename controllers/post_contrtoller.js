const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
    // Post.create({
    //     content: req.body.content,
    //     user: req.user._id
    // }, function(err, post){
    //     if(err){
    //         console.log(`error in creating a post`);
    //         return;
    //     }
    //     return res.redirect('back');

    // })

    // async + await convention
    try{
        await Post.create({
                content: req.body.content,
                 user: req.user._id
             });
            req.flash('success' ,'Post published!');
            return res.redirect('back');
    }catch(err){
        req.flash('error' , err);
        console.log(`error in creating a post : ${err}`);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res){
    // Post.findById(req.params.id, function(err, post){
    //     // we are comparing the string here .id will auto convert the object id with string
    //     // .id means converting the obj id into string 
    //     if(post.user == req.user.id){
    //         post.remove();

    //         Comment.deleteMany({post:req.params.id}, function(err){
    //             return res.redirect('back');
    //         });
    //     } else {
    //         return res.redirect('back');
    //     }
    // });

    try {
        let post = await Post.findById(req.params.id);
        // we are comparing the string here .id will auto convert the object id with string
        // .id means converting the obj id into string 

        if(post.user == req.user.id){
            post.remove();
            // below code is already async we are await for it to be executed 
            await Comment.deleteMany({post:req.params.id});
            req.flash('success' ,'Post and associated comments deleted!');
            return res.redirect('back');
        } else {
            req.flash('error' ,'you cannot delete this post');
            return res.redirect('back');
    }
    } catch (err) {
        req.flash('error' , err);
        console.log(`error in creating a post : ${err}`);
        return res.redirect('back');
    }
    
}