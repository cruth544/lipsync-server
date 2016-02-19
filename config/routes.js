var express = require('express')
var router  = new express.Router()
var jwt = require('jsonwebtoken')
var UserController = require('../controllers/UserController')
var SongController = require('../controllers/SongController')
var SnippetController = require('../controllers/SnippetController')

router.route('/user/authenticate')
  .post(UserController.authenticate)

router.route('/user/signup')
  .post(UserController.signUp)

router.use(function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    jwt.verify(token, process.env.SUPER_SECRET, function (err, decoded) {
      if (err) {
        res.status(403).send({
          success: false,
          message: "Failed to authenticate token"
        })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.status(403).send({
      success: false,
      message: "No token provided"
    })
  }
})

router.get('/user/status', function(req, res) {
  res.send(req.decoded)
})

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
