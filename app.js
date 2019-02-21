const express = require('express');
const hbs = require('hbs');
const fs = require('fs');


const app = express();

hbs.registerPartials(__dirname +'/views/partials');

hbs.registerHelper('capitalizeIt', (words) => {
  return (
    words.split(/\s+/ig)
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  );
});

app.set('view engine', 'hbs');

app.use((req, res, next) => {
  const log = `${new Date().toString()} ${req.method} ${req.url}`;
  fs.appendFile('note.log', log + '\n\n', ((error) => {
    if (error)
    console.log('Something went wrong. can\'t add log');
  }));
  console.log(`${log}`);
  next();
});

app.use((req, res, next) => {
  res.render('maintenance.hbs', {
    message: 'Maintenance is ongoing, We will be write back.',
    pageTitle: 'Maintenance page',
  });
})
app.use('/', express.static(__dirname + '/public'));



hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});


app.get('/home', (req, res) => {
  res.render('home.hbs');
});

app.get('/news', (req, res) => {
  res.render('news.hbs', {
    pageTitle: 'News Page',
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
  });
});

app.get('*', (req, res) => {
  res.render('404.hbs', {
    address: req.url.slice(1),
    pageTitle: '404 page',
  })
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server running on port', port));