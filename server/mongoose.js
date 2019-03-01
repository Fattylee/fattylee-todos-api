const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1/TodoApp', { useNewUrlParser: true })
  .then( res => console.log('Connected to mongodb successfully'))
  .catch( err => console.log('Unable to connect to mongodb:', err));

module.exports = mongoose;