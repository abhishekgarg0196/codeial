const express = require('express');
const router = express.Router();
const passport = require('passport');

const postController = require('../controllers/post_contrtoller');

router.post('/create' ,passport.checkAutheticated, postController.create);

module.exports = router;