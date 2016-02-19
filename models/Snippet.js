var mongoose = require('mongoose')

var SnippetSchema = mongoose.Schema({
  owner:      String,
  startTime:  Number,
  endTime:    Number,
  videoUrl:   String
})

module.exports = mongoose.model('Snippet', SnippetSchema)
