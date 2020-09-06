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
            return res.redirect('back');
    }catch(err){
        console.log(`error in creating a post : ${err}`);
        return;
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
            return res.redirect('back');
        } else {
            return res.redirect('back');
    }
    } catch (err) {
        console.log(`error in creating a post : ${err}`);
        return;
    }
    
}