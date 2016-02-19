'use strict'
var Song = require('../models/Song')
var Snippet = require('../models/Snippet')
var User = require('../models/User')
var AWS = require('aws-sdk')
var fs = require('fs')

var formidable = require('formidable'),
    http = require('http'),
    util = require('util')
var multiparty = require('multiparty')

var mongoose = require('mongoose')

module.exports = {
  getSongsList: function (req, res, next) {
    Song.find({})
    .populate('snippets users owner')
    .exec(function (err, songs) {
      if (err) return console.log("Get Songs Error: ", err)
      res.json(songs)
    })
  },
  getSong: function (req, res, next) {
    console.log('Query: ', req.query)
    console.log('Body: ', req.body)
  },
  addSnippet: function (snippet, songFile, options) {
    if (songFile) {
      var newSong = new Song()
      for(var key in options) {
        newSong[key] = options[key]
      }
      newSong.snippets.push(snippet)
      newSong.users.push(options.owner)
      newSong.save(function (err) {
        if (err) return console.log('ERROR: ', err)
      })
    } else {
      Song.update(
        { "songUrl": options.songUrl[0] },
      { "$push": {
            "snippets": snippet._id,
            "users": options.owner
        }},
        function(err, numAffected) {
          if (err) {
            console.log("Update error: ", err)
          }
        })
    }
  }
}




