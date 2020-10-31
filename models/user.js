const mongoose = require('mongoose');
// Multer is configured seperately for each type because the path where the files will be uploaded is different
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars') // it will refer to actual path 

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
});

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', AVATAR_PATH)); // CURRENT PATTH i.e models/user.js + neighbour dir i.e models + AVATAR PATH 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()); // fieldname: 	Field name specified in the form
  }
});

// static methods
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar'); // by this it's an static method and allowing only single/ one instance file 
userSchema.statics.avatarPath = AVATAR_PATH;  // This path will be available publically for the user model, we will access it in controller to save in avatar property


const User = mongoose.model('User', userSchema);

module.exports = User;