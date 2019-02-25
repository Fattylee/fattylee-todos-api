const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('<h1>Server test app');
});

app.get('/users', (req, res) => {
  res.status(200).send([
  {
    name: 'Abu Adnaan',
    age: 31,
  },
  {
    name: 'Lukman Dev',
    age: 23,
  }
  ]);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server running on port', port);
});
module.exports.app = app;