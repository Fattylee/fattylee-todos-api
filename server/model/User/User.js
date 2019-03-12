const validator = require('validator');
const mongoose = require('../../mongoose');


const User = mongoose.model('Users', {
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
   
     tokens: {
       type: String,
       required: true,
     }
   }
 ]
});


module.exports = {
  User,
};