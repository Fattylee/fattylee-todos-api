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
  const pass = err.details.length > 1;
    let error = { message: err.details[0].message };
    if(pass) {
      
       error = err.details.map(e =>( {message: e.message }));
       return {message: 'Invalid input', error};
      }
      
      return {message: 'Invalid input', error};
}

module.exports = {
  filePath,
  logger,
  validate,
  formatError,
}