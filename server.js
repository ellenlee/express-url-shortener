const express = require('express');
const bodyParser= require('body-parser')
const mongoose = require('mongoose');
const makeid = require('./lib/makeid');
const Url = require('./models/url');
const exphbs = require('express-handlebars');

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

mongoose.connect('mongodb://url-shortener:123123123@ds259117.mlab.com:59117/url-shortener')
var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    app.listen(3000, () => {
    console.log('listening on port 3000');
  })
})

app.use(bodyParser.urlencoded({extended: true}));

// routes
app.get('/', (req, res) => {
  res.render('index');
})

app.post('/urls', (req, res) => {
  let url = Url({
    longUrl: req.body.url,
    shortUrl: makeid.makeid()
  })

  Url.findOne({longUrl: url.longUrl}, (err, doc) => {
    if (doc) {
      res.render('show', {shortUrl: doc.shortUrl})
    } else {
      url.save((err, url) => {
        if (err) return console.error(err);
        res.render('show', {shortUrl: url.shortUrl})
      })
    }
  })
})

app.get('/:shortened_id', (req, res) => {
  let shortenedId = req.params.shortened_id

  Url.findOne({shortUrl: shortenedId}, (err, doc) => {
    if (doc) {
      res.redirect(doc.longUrl)
    } else {
      res.redirect('/')
    }
  })
})
