const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('<p>welcome to the best app</h1>');
});

app.get('/about', (req, res) => {
  res.json({
    message: 'This is about page',
    body: {
      name:  'Abu Adnaan',
      age: 31,
      gender: 'male'
    }
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server running on port', port));