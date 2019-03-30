const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');
const { format } = require('../../../helpers/utils');

const todoPayload = [
{text: 'todo item 1', _id: new ObjectID(), completed: true, completedAt: Date.now() },
{text: 'todo item 2',  _id: new ObjectID()}
];

const _id = new ObjectID();
const id2 = new ObjectID();
const secrete = 'haleemah123';
const access = 'auth';
const plainPassword = 'password1';
const plainPassword2 = 'password2';
const userPayload = [
  { 
  __v: 0,
  email: 'abc@gmail.com',
  password: bcrypt.hashSync(plainPassword, 10),
  _id,
  tokens: [{
    access,
    token: jwt.sign({_id, access }, secrete),
    _id: new ObjectID(),
    }]  
  },
   { 
  __v: 0,
  email: 'abcvh@gmail.com',
  password: bcrypt.hashSync(plainPassword2, 10),
  _id: id2,
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