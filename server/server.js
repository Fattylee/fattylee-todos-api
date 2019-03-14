require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Joi = require('joi');
const {ObjectID} = require('mongodb');
const path = require('path');


const mongoose = require('./mongoose');
const Todo = require('./model/Todo/Todo').Todo;
const { User } = require('./model/User/User');
const { logger, validate, formatError } = require('./../helpers/utils');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

if(require('./config/config') === 'development')
app.use(logger);

/*
app.use('/', (req, res, next) => {
  res.send('<h1>Website is under maintenance</h1>');
})*/

app.use('/', express.static(path.join(__dirname, '..', 'public')));


app.get('/todos/:id', (req, res) => {
  const {id} = req.params;
  
  if(!ObjectID.isValid(id)) return res.status(404).json({ message: 'Invalid todo id:' + id});
  
  Todo.findById(id)
    .then(todo => {
      if(!todo) return res.status(404).send({ message: 'todo item not found: ' + id});
      
      res.status(200).send({todo});
    })
    .catch(err => res.send(err));
});

app.get('/todos', (req, res) => {
  Todo.find()
    .sort('text')
    //.select('text -_id')
    .then(docs => {
      res.status(200).send({todos: docs});
    },
    
    err => console.log(err));
    
});

app.post('/todos', (req, res) => {
  
  Joi.validate(
    req.body,
    Joi.object().keys({text: Joi.string().min(5).trim().required()}))
  .then( value => {
    
    Todo.insertMany({
    text: req.body.text,
    completed: false,
    completedAt: null
  })
    .then(doc => {
      res.status(201).send(doc[0]);
    })
    .catch(err => {
      res.status(400).send(err);
    })
  })
  .catch( err => {
    const error = formatError(err); 
    res.status(400).send(error)
  })
  
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  
  if(!ObjectID.isValid(id)) return res.status(400).send({ message: 'Invalid todo id'});
  
  Todo.findByIdAndDelete(id)
    .then(doc => {
      if(!doc) return res.status(404).send({message: 'Todo not found'});
      
      res.status(200).send(doc)
    })
    .catch(err => res.send(err));
});

app.patch('/todos/:id', (req, res) => {
  
  validate(req.body)
  .then(result => {
    
  const { id } = req.params;
  
   if(!ObjectID.isValid(id)) return res.status(400).send({ message: 'Invalid todo id'});
   if(req.body.completed === false)
     req.body.completedAt = null;
   
   if(req.body.completed) {
     req.body.completedAt = new Date().getTime();
   }
   
  
  Todo.findOneAndUpdate({_id: id}, req.body, {useFindAndModify: false, new: true})
    .then(doc => {
      
      if(!doc) return res.status(404).send({ message: 'Todo not found'});
      
      res.status(200).send({todo: doc});
    })
    .catch(err => res.send(err));
  })
  .catch(err => {
    
    const error = formatError(err);
    
    res.status(400).send(error);
    });
});

app.post('/users', async (req, res) => {
  try {
    const body = await Joi.validate(req.body, Joi.object().keys({
    email: Joi.string().trim().email({ minDomainAtoms: 2 }).min(5).lowercase().required(),
    password: Joi.string().trim().min(4).required(),
    tokens:[Joi.object()],
  }));
  
  const { email, password, tokens } = body;
    const findUser = await User.findOne({ email: { $regex: new RegExp(email, 'i')}});
    
    if(findUser)
      return res.status(409).send({message: 'email already exist'});
      
    const user = new User({
      email,
      password,
      tokens,
    });
    
    const doc = await user.save();
    return res.status(201).send({ user: doc});
    H
  } catch( err ) {
    //return res.send(err);
    if(err.errmsg && err.errmsg.includes('duplicate key error'))
    return res.status(409).send({message: "email already exist"});
    
    res.status(400).send(formatError(err));
  }
  
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    users.reverse();
    res.status(200).send({ users});
  } catch (err) {
    res.send(err);
  }
})

app.delete('/users', (req, res) => {
  User.deleteMany().then(() => {
    res.send({ message: 'all users deleted'});
  })
})

app.all('*', (req, res) => {
 res.status(200).redirect('/404_error-web')
});

app.post('/test', async (req, res) => {
  try {
    const user = new User(req.body);
    const userFromServer = await user.save();
    return res.send({user, userFromServer});
  } catch( err ) {
    res.send({err});
  }
})

const port = process.env.PORT;

app.listen(port, () => console.log('Server running on port', port));

module.exports = app;