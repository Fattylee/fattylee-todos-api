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
const plainPassword = '12344671';
const plainPassword2 = '12344vvh';
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
  /*tokens: [{
    token: jwt.sign({_id: id2, access}, secrete),
    _id: new ObjectID(),
    access,
  }]*/
  }
];

let counter = 0;
/*
const populateDB = async () => {
  try {
    await Promise.all([
    Todo.deleteMany(), User.deleteMany()]).catch( err => { throw err });
    
   const all = await  Promise.all([
   Todo.insertMany(todoPayload), 
   User.insertMany(userPayload),
   ]).catch( err => { throw err });
   
   //const users = await User.find().catch(console.error);
 //  console.log(++counter, users);
  } catch( err ) { console.error(err); }
 
}*/
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

const populateUsers = async () => {
    try {
      await User.deleteMany().catch( err => { throw err });
      await User.insertMany(userPayload).catch( err => { throw err });
      
    } catch( err ) { console.error(err); }
};

module.exports = {
  userPayload,
  todoPayload,
  populateDB,
  populateUsers,
  plainPassword,
  plainPassword2,
};