const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true })
  .then( res => console.log('Connected to mongodb successfully'))
  .catch( err => console.log('Unable to connect to mongodb:', err));

module.exports = mongoose;