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

const validateUser = (body) =>
  (
  Joi.validate(body, Joi.object().options({ abortEarly: false }).keys({
        email: Joi.string().trim().email({ minDomainAtoms: 2 }).min(5).lowercase().required(),
        password: Joi.string().trim().min(4).required(),
        /*
        tokens:[Joi.object().keys({
          access: Joi.string().required(),
          token: Joi.string().required()
        })],
        */
      }))
    );
const formatError = (err) => {
  
  const message = 'Invalid input';
  const error = err.details.map(e =>( {message: e.message }));
       return {message, error};
}

const format = obj => JSON.stringify(obj, null, 2);
const validateHeader = (header) => {
  return (Joi.validate({ header }, Joi.object().keys({
      header: Joi.string().required().label('x-auth Header'),
    })));
}
module.exports = {
  filePath,
  logger,
  validate,
  formatError,
  validateUser,
  format,
  validateHeader,
}