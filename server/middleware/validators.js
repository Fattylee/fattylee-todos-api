const Joi = require('joi');
const { ObjectID } = require('mongodb');
const { formatError, saveLog } = require('../../helpers/utils');

const validateTodo = async (req, res, next) => {
 try {
    const todoSchema = Joi.object().options({abortEarly: false}).keys({
    text: Joi.string().min(5).trim().required(),
  });
  const payload = await Joi.validate(req.body, todoSchema).catch( err => { throw err });
  req.payload = payload;
  next();
 }
 catch(err) {
   // save all error messages to .error.log
   saveLog(err);
   res.status(400).send(formatError(err));
 }

};

const validateTodoIdParams = (req, res, next) => {
  if(!ObjectID.isValid(req.params.id)) return res.status(400).send({ message: 'Invalid todo id'});
  next();
};

module.exports = {
  validateTodo,
  validateTodoIdParams,
}