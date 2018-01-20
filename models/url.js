const mongoose = require('mongoose');

var urlSchema = mongoose.Schema({
  longUrl: String,
  shortUrl: String
})

var Url = mongoose.model('Url', urlSchema)

module.exports = Url;
