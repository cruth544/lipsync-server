
var express = require('express')
var router  = new express.Router()
var UserController = require('../controllers/UserController')
var SongController = require('../controllers/SongController')
var SnippetController = require('../controllers/SnippetController')

// var passport = require('passport')
  // require("./passport")(passport)

// VIDEO ROUTES
router.route('/song/list')
  .get(SongController.getSongsList)

router.route('/song/:song')
  .get(SongController.getSong)

router.route('/song')
  .post(SnippetController.addSnippet)

router.route('/snippets/:song')
  .get(SnippetController.getSnippetsForSong)

// USER ROUTES
// router.route('/user/all')
  // .get(UserController.getAll)
// router.route('/auth/facebook')
//   .get(passport.authenticate('facebook', {scope: 'email'}));

// router.route('/auth/facebook/callback')
//   .get(passport.authenticate('facebook', {
//     successRedirect: '/',
//     failureRedirect: '/'
//   }));

module.exports = router;
