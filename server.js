const express = require('express');
const makeid = require('./lib/makeid');
const mongoose = require('mongoose');
const Url = require('./models/url');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Handlebars for templating engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Static files to be served in `/public` folder
app.use(express.static(path.join(__dirname, '/public')));

// bodyParser to parse information from forms
app.use(bodyParser.urlencoded({ extended: true }));

// Establish a connection with Mongoose before setting the app to listen for requests
mongoose.connect('mongodb://url-shortener:123123123@ds259117.mlab.com:59117/url-shortener');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  app.listen(3000, () => {
    console.log('listening on port 3000');
  });
});

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/urls', (req, res) => {
  const url = Url({
    longUrl: req.body.url,
    shortUrl: makeid.makeid(),
  });

  Url.findOne({ longUrl: url.longUrl }, (err, doc) => {
    if (doc) {
      res.render('show', { hostname: req.headers.host, shortUrl: doc.shortUrl });
    } else {
      url.save((error, savedUrl) => {
        if (error) return console.error(error);
        res.render('show', { hostname: req.headers.host, shortUrl: savedUrl.shortUrl });
      });
    }
  });
});

app.get('/:shortened_id', (req, res) => {
  const shortenedId = req.params.shortened_id;

  Url.findOne({ shortUrl: shortenedId }, (err, doc) => {
    if (doc) {
      res.redirect(doc.longUrl);
    } else {
      res.redirect('/');
    }
  });
});
