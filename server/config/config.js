const env = process.env.NODE_ENV || 'development';

if( env === 'development') {
  process.env.PORT = 4000;
  process.env.MONGOLAB_URI = 'mongodb://127.0.0.1/TodoApp';
  process.env.SUPER_USER_KEY='auth@212';
} 

else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGOLAB_URI = 'mongodb://127.0.0.1/TodoAppTest';
  process.env.SUPER_USER_KEY='auth@212';
}

else if(env === 'staging') {
  process.env.MONGOLAB_URI = process.env.TEST_DB
}

module.exports = env;