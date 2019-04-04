require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

if( env === 'development') {
  process.env.PORT = 4000;
  process.env.MONGOLAB_URI = 'mongodb://127.0.0.1/TodoApp';
} 

else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGOLAB_URI = 'mongodb://127.0.0.1/TodoAppTest';
}

else if(env === 'staging') {
  process.env.PORT = 8080;
  process.env.MONGOLAB_URI = process.env.TEST_DB;
}

module.exports = env;