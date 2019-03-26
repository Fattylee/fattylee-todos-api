const { formatError, validateHeader, saveLog, format } = require('./../../helpers/utils');

const { User } = require('./../models/user');


const authenticated = async (req, res, next) => {
try {
     
    const head = await validateHeader(req.header('x-auth')).catch( err => { throw {statusCode: 401, error: err }});
    const { header: token } = head;
    const user = await User.findByToken(token).catch( err => { throw err });
    if(!user) throw { statusCode: 404, error:{message: 'user not found'} };
    req.user = user;
    next();
  } catch (err) {
    // save all error messages to .error.log
    saveLog(err);
    if(err.error && err.error.details) return res.status(err.statusCode).send(formatError(err.error));
    if(err.statusCode) return res.status(err.statusCode).send(err.error);
    
    res.status(500).send({ error: err.message || err });
  }
};

module.exports = {
  authenticated,
};