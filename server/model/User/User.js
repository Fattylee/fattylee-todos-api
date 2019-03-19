const validator = require('validator');
const mongoose = require('../../mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
    validate: {
      validator:validator.isEmail,
      message: '{VALUE} not a valid email'
    },
  },
 password: {
   type: String,
   required: true,
   minlength: 4,
 },
 tokens: [
   {
     access: {
       type: String,
       required: true,
     },
     token: {
       type: String,
       required: true,
     }
   }
 ]
});


UserSchema.methods.generateAuthUser = function () {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({ _id: user._id.toString(), access }, 'haleemah123');
  user.tokens = [...user.tokens, {access,token}];
  
  return user.save();
};

const User = mongoose.model('Users', UserSchema);

module.exports = {
  User,
};