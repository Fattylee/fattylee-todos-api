const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');
const { format } = require('../../../helpers/utils');

const todoPayload = [
{text: 'todo item 1', _id: new ObjectID(), completed: true, completedAt: Date.now() },
{text: 'todo item 2',  _id: new ObjectID()}
];

const _id = new ObjectID();
const userPayload = [
  { 
  __v: 0,
  email: 'abc@gmail.com',
  password: '12344671',
  _id,
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id, access: 'auth'}, 'haleemah123'),
    _id: new ObjectID(),
    }]  
  },
   { 
  __v: 0,
  email: 'abcvh@gmail.com',
  password: '12344vvh',
  _id: new ObjectID(),
  tokens: []
  }
];

let counter = 0;

const populateDB = async () => {
  try {
    await Promise.all([
    Todo.deleteMany(), User.deleteMany()]).catch( err => { throw err });
    
   const all = await  Promise.all([
   Todo.insertMany(todoPayload), 
   User.insertMany(userPayload),
   ]).catch( err => { throw err });
    
  } catch( err ) { console.error(err); }
 
}

module.exports = {
  userPayload,
  todoPayload,
  populateDB,
};