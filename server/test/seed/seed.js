const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');
const { format } = require('../../../helpers/utils');

const _id = new ObjectID();
const id2 = new ObjectID();
const id3 = new ObjectID();
const id4 = new ObjectID();
const access = 'auth';
const plainPassword = 'password1';
const plainPassword2 = 'password2';
const plainPassword3 = 'password3';
const userPayload = [
  { 
  __v: 0,
  email: 'abc@gmail.com',
  password: bcrypt.hashSync(plainPassword, 10),
  _id,
  isAdmin: true,
  tokens: [{
    access,
    token: jwt.sign({_id, access }, process.env.JWT_SECRETE),
    _id: new ObjectID(),
    }]  
  },
   { 
  __v: 0,
  email: 'abcvh@gmail.com',
  password: bcrypt.hashSync(plainPassword2, 10),
  _id: id2,
  isAdmin: false,
  },
  {
  __v: 0,
  email: 'xyz@gmail.com',
  password: bcrypt.hashSync(plainPassword3, 10),
  _id: id3,
  isAdmin: false,
  tokens: [{
    access,
    token: jwt.sign({_id: id3, access }, process.env.JWT_SECRETE),
    _id: new ObjectID(),
    }]  
  },
  {
  __v: 0,
  email: 'fatty@gmail.com',
  password: bcrypt.hashSync(plainPassword3, 10),
  _id: id4,
  isAdmin: true,
  tokens: [{
    access,
    token: jwt.sign({_id: id4, access }, process.env.JWT_SECRETE),
    _id: new ObjectID(),
    }]  
  },
];

const todoPayload = [
{
  text: 'todo item 1', 
  _id: new ObjectID(), 
  _owner: _id,
},
{
  text: 'todo item 2',
  _id: new ObjectID(),
  _owner: id2,
},
{
  text: 'todo item 3',
  _id: new ObjectID(),
  _owner: _id,
}
];

let counter = 0;

const populateDB = (done) => {
  try {
    Promise.all([
    Todo.deleteMany(), User.deleteMany()])
    .then(all => {
      return (Promise.all([
   Todo.insertMany(todoPayload), 
   User.insertMany(userPayload),
   ]).catch( err => { throw err }));
   })
   .then(all => {
     done()
   })
   .catch( err => { throw err });
    
  } catch(err){ done(err); }
 
};

module.exports = {
  userPayload,
  todoPayload,
  populateDB,
  plainPassword,
  plainPassword2,
};