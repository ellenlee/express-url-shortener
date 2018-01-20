const Url = require('../models/url')

// function to make a random 5-char string
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  Url.findOne({shortUrl: text}, (err, doc) => {
    if (doc) {
      makeid();
    }
  })
  return text;
}

module.exports.makeid = makeid;
