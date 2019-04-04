const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGOLAB_URI)
  .then( res => console.log('Connected to mongodb successfully'))
  .catch( err => {
    console.log('Unable to connect to mongodb:', JSON.stringify(err, null, 2));
  });

module.exports = mongoose;