
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function (req, res) {
    try {
        let user = await  User.findOne({email: req.body.email}); 
        
        if(!user || user.password != req.body.password){
            return res.json(422, {
                message:"Invalid username of password"
            });
        }
        
        return res.json(200, {
            message: "Sign in successful, here is your token keep it safe !",
            data : {
                // Only user info is encrypted which we call as claim
                // and then there is an header and signature to it
                token : jwt.sign(user.toJSON(),'codeial', {expiresIn: 100000})
            }
        });
    } catch (err) {
        console.log(`Error in getting the user : ${err}`);
        return res.json(500, {
            message:"Internal server Error"
        });
    }
};