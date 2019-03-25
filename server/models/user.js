const validator = require('validator');
const mongoose = require('../mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

UserSchema.pre('save', function ( next ){
  const user = this;
  if(user.isModified('password')) {
    const { password } = user;
    bcrypt.genSalt(10, (err, salt) => {
      if(err) throw err;
      bcrypt.hash(password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else { next();}
});

UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded = undefined;
  try {
  decoded = jwt.verify(token, 'haleemah123');
  } catch( err ) { throw { statusCode: 401, error: err }}
  
  const { _id } = decoded;
  return User.findOne({_id});
};

UserSchema.methods.toJSON = function () {
  const {_id: id, email } = this.toObject();
  return { id, email };
};

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