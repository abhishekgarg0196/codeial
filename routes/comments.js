const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentController = require('../controllers/comments-controller');

router.post('/create' ,passport.checkAutheticated, commentController.create);

module.exports = router;