const Joi = require('joi');

const filePath = (dir, path) => {
  return (
    dir.includes('\\') ? path.replace(/\//g, '\\') : path
  );
}
const logger = (req, res, next) => {
  const url = req.url;
  const type = req.method;
  console.log(`${new Date().toString()} ${type} ${url}`);
  console.log('=================');
  next();
};

const validate = (body) => {
const schema = Joi.object().keys({
  
  text: Joi.string().trim().min(5),
  
  completed: Joi.boolean(),

})//.with('username', 'birthyear')
//.without('password', 'text');

return Joi.validate(body, schema);
};

const formatError = (err) => {
  
  const message = 'Invalid input';
  const error = err.details.map(e =>( {message: e.message }));
       return {message, error};
}

module.exports = {
  filePath,
  logger,
  validate,
  formatError,
}