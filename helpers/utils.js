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

//    username: Joi.string().alphanum().min(3).max(30).required(),

   // password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),

  //  access_token: [Joi.string().required(), Joi.number().required()],

  //  birthyear: Joi.number().integer().min(1900).max(2013),

  //  age: Joi.number().required().min(18).max(99),

    //email: Joi.string().email({ minDomainAtoms: 2 })

})//.with('username', 'birthyear')
//.without('password', 'text');

return Joi.validate(body, schema);
};



module.exports = {
  filePath,
  logger,
  validate,
}