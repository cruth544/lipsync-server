'use strict'
var User = require('../models/User')
var Song = require('../models/Song')
var SongController = require('../controllers/SongController')
var Snippet = require('../models/Snippet')
var AWS = require('aws-sdk')
var fs = require('fs')

var formidable = require('formidable'),
    http = require('http'),
    util = require('util')
var multiparty = require('multiparty')

var mongoose = require('mongoose')

module.exports = {
  addSnippet: function (req, res, next) {
    AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_KEY_ID})
    AWS.config.region = 'us-west-2'
    var s3Client = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY_ID
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    });

    var form = new multiparty.Form();
    var status = {saved: false}
    var options = {name: null, owner: null}
    var snippet = {}
    var bucket = 'lipsyncwith.us-data'
    form.parse(req, function (err, fields, files) {
      // res.writeHead(200, {'content-type': 'text/plain'});
      // res.write('received upload:\n\n');
      // res.end(util.inspect({fields: fields, files: files}));

      // set up snippet for new snippet
      snippet.videoUrl = 'Videos/' + fields.fileName[0]
      snippet.startTime = fields['video[audio][startTime]'][0]
      snippet.endTime = fields['video[audio][endTime]'][0]

      // write options for db save
      options.name = fields['newSongName']
      options.owner = fields['owner']
      options.songUrl = fields['audio[songUrl]']

      // UPLOAD SONG (if new song)
      if (files['audio[songFile]']) {
        snippet.songUrl  = 'Songs/' + fields.fileName[0] + '_' + files['audio[songFile]'][0]['originalFilename']
        options.songUrl = snippet.songUrl
        var song = fs.createReadStream(files['audio[songFile]'][0]['path'])
        s3Client.putObject({
          Bucket: bucket,
          Key: snippet.songUrl,
          ACL: 'public-read',
          Body: song
        }, function(err, data) {
          if (err) throw err;
        })
      }

      // UPLOAD VIDEO
      var video = fs.createReadStream(files['video[blob]'][0]['path'])
      s3Client.putObject({
        Bucket: bucket,
        Key: snippet.videoUrl,
        ACL: 'public-read',
        Body: video
      }, function(err, data) {
        if (err) throw err;
        // return //don't save to db yet
        var newSnippet = new Snippet()
        for (var key in snippet) {
          newSnippet[key] = snippet[key]
        }
        newSnippet.save(function (err) {
          if (err) return console.log(err)
          status.saved = true
          SongController.addSnippet(newSnippet, song, options)
        })
        // console.log("done", data);
        // console.log("https://s3.amazonaws.com/" + bucket + '/' + snippet.videoUrl);
      });

    });
    res.json(status)
  },
  getSnippetsForSong: function (req, res, next) {
    Song.findById(req.params.song)
      .then(function (song) {
        Snippet.populate(song, { path: 'snippets', model: 'Snippet' }, function (err, song) {
          res.send(song.snippets)
        })
      }, function (err) {
        console.log("Get Snippets Error: ", err)
      })
  }
}

















