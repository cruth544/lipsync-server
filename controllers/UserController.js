var User = require("../models/User");
var mongoose = require('mongoose')
var jwt = require('jsonwebtoken')
// var request = require('request')

module.exports = {
  authenticate: function (req, res, next) {
    User.findOne({ email: req.body.email })
      .select('email username password').exec(function (err, user) {
        if (err) return console.log("Auth Error: ", err)

        if (!user) {
          res.json({
            success: false,
            message: "Authentication Failed: User not found"
          })
        } else {
          var validPassword = user.comparePasswordSync(req.body.password)
          if (!validPassword) {
            res.json({
              success: false,
              message: "Authentication failed. Wrong password"
            })
          } else {
            var token = jwt.sign({
              _id: user._id,
              email: user.email,
              username: user.username
            }, process.env.SUPER_SECRET, {
              expiresInMintues: 1440
            })

            res.json({
              success: true,
              message: "Token!",
              token: token
            })
          }
        }
    })
  },
  signUp: function (req, res, next) {
    User.findOne({ email: req.body.email })
      .select('email').exec(function (err, user) {
        if (user) {
          res.json({
            success: false,
            message: 'User exists'
          })
        } else {
          var newUser = new User()
          for (var key in req.body) {
            newUser[key] = req.body[key]
          }
          newUser.save(function (err) {
            if (err) {
              console.log("User Save: ", err)
              res.json({
                success: false,
                message: 'Save error'
              })
            } else {
              res.json({
                success: true,
                message: 'User saved!'
              })
            }
          })
        }
      })
  }
}
