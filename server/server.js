const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const {ObjectID} = require('mongodb');

const mongoose = require('./mongoose');
const Todo = require('./model/Todo/Todo').Todo;
const { User } = require('./model/User/User');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
// app.use(require('../helpers/utils').logger);


app.get('/', (req, res) => {
  res.status(200).send('<h1>Welcome to my Todo App, Have fun!</h1>');
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

app.get('/todos', (req, res) => {
  Todo.find()
    .sort('text')
    //.select('text -_id')
    .then(docs => {
      res.status(200).send(docs);
    },
    
    err => console.log(err));
    
});

app.post('/todos', (req, res) => {
  Todo.insertMany({
    text: req.body.text,
    completed: req.body.completed,
    completedAt: req.body.completedAt
  })
  

    .then(doc => {
      res.status(201).send(doc);
    })
    .catch(err => {
      res.status(400).send(err);
    })
})

const port = process.env.PORT ||  4000;

app.listen(port, () => console.log('Server running on port', port));

module.exports = app;