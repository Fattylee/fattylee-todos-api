require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Joi = require('joi');
const {ObjectID} = require('mongodb');
const path = require('path');


const mongoose = require('./mongoose');
const Todo = require('./models/todo').Todo;
const { User } = require('./models/user');
const { logger, validate, formatError, validateUser, format } = require('./../helpers/utils');
const { authenticated } = require('./middleware/authenticated')


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

app.get('/todos', (req, res) => {
  Todo.find()
    .sort('text')
    //.select('text -_id')
    .then(docs => {
      res.status(200).send({todos: docs});
    },
    
    err => console.error(err));
    
});

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

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    users.reverse();
    res.status(200).send({ users });
  } catch (err) {
    res.send(err);
  }
})

app.delete('/users', (req, res) => {
  User.deleteMany().then(() => {
    res.status(200).send({ message: 'all users deleted'});
  }).catch( err => { console.error(err); })
});

app.post('/users', async (req, res) => {
  try {
    const value = await validateUser(req.body).catch( err => { throw err });
    
    const { email } = value;
    const user = new User(value);
    
    const emailExist = await User.findOne({ email }).catch( err => { throw err });
    
    if(emailExist) throw { message: 'email already exist', statusCode: 409 };
    
    const newUser = await user.generateAuthUser().catch( err => { throw err });
  
  const { tokens: [{token}] } = newUser;
  res.status(201).header('x-auth', token).send(newUser);
    }
    catch ( err ) {
      fs.appendFile('.error.log', JSON.stringify(err, null, 2) + '\n===========', err => { if(err) console.error(err.error); });
      
      if(err.details) return res.status(400).send(formatError(err));
      
    res.status(err.statusCode || 500 ).send({error: err.message || err });
    }
});

app.get('/users/abu', authenticated, (req, res) => {
  res.status(200).send(req.user);
});

app.all('*', (req, res) => {
  
 res.status(200).redirect('/404_error-web')
});


const port = process.env.PORT;

app.listen(port, () => console.log('Server running on port', port));

module.exports = app;
