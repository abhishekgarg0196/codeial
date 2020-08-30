const express = require('express');
const router = express.Router();
const passport = require('passport');

const postController = require('../controllers/post_contrtoller');

router.post('/create' ,passport.checkAutheticated, postController.create);
router.get('/destroy/:id' ,passport.checkAutheticated, postController.destroy);


module.exports = router;