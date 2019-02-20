const express = require('express');
const hbs = require('hbs');
const app = express();

hbs.registerPartials(__dirname +'/views/partials');
app.set('view engine', 'hbs');
app.use('/home', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send('<p>welcome to the best app</h1>');
});

app.get('/news', (req, res) => {
  res.render('news.hbs', {
    pageTitle: 'News Page',
    year: new Date().getFullYear(),
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    message: 'This is about page',
    body: {
      name:  'Abu Adnaan',
      age: 31,
      gender: 'male'
    },
    pageTitle: 'About page',
    year: new Date().getFullYear(),
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server running on port', port));