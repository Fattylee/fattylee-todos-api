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
 isAdmin: {
   type: Boolean,
   default: false,
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
 ],
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
  return User.findOne({
    _id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};

UserSchema.statics.findByCredentials = async function ({email, password}) {
  
  const validUser = await User.findOne({email}).catch(err => { throw err});
    if(!validUser) throw { statusCode: 401, message: 'incorrect email or password' };
    const pass = bcrypt.compareSync(password, validUser.password);
    
    if(!pass) throw { statusCode: 401, message: 'incorrect email or password' };
    return validUser;
};

UserSchema.methods.toJSON = function () {
  const {_id, email } = this.toObject();
  if (process.env.NODE_ENV === 'test')
  return this.toObject();
  return { _id, email };
};

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({ _id: user._id.toString(), access }, 'haleemah123');
  user.tokens = [...user.tokens, {access,token}];
  
  await user.save().catch( err => { throw err });
  return token;
};

UserSchema.methods.removeToken = async function (token) {
  try {
    const user = this;
    
    return user.updateOne({
      $pull: {
        tokens: { token,}
      }
    });
  }
  catch(err) {
    throw err;
  }
}

const User = mongoose.model('Users', UserSchema);

module.exports = {
  User,
};