const env = process.env.NODE_ENV || 'development';

if(env === 'test' || env === 'development' || env === 'staging') {
  const envConfig = require('./config.json')[env];
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key]
  })
}

module.exports = env;
