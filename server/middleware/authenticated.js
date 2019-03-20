const { formatError, validateHeader } = require('./../../helpers/utils');

const { User } = require('./../model/User/User');


const authenticated = async (req, res, next) => {
try {
     
    const pass = await validateHeader(req.header('x-auth')).catch( err => { throw {statusCode: 401, error: err }});
    
    const token = req.header('x-auth');
    const user = await User.findByToken(token).catch( err => { throw err });
    if(!user) throw { statusCode: 404, error:{message: 'user not found'} };
    req.user = user;
    next();
  } catch (err) {
    if(err.error.details) return res.status(err.statusCode).send(formatError(err.error));
    if(err.statusCode) return res.status(err.statusCode).send(err.error);
    
    res.send(err);
  }
};

module.exports = {
  authenticated,
};
