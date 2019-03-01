const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/TodoApp',{ useNewUrlParser: true })
  .then(res => {
    console.log('Connection to mongodb was succesful');
  })
  .catch(err => console.log('Unable to connect to mongodb', err));
  
  /*
const Todo = mongoose.model('Todos', {
  text: {
    type: String,
  },
  completed: {
    type: Boolean,
  },
  completedAt: {
    type: Number,
  }
});

const newTodo = new Todo({
  text: 'build facebook from scratch',
  completed: false,
});

newTodo.save()
  .then(console.log)
  .catch(console.log);
  */
  
const User = mongoose.model('Users', {
  email: {
    type: String,
    minlength: 5,
    trim: true,
    required: true,
  }
});

const newUser = new User({
  email: ' fattylee.remod@gmail.com   ',
});

newUser.save()
  .then(doc => {
    console.log('Saved docs', doc);
  })
  .catch(err => {
    console.log('Cannot save user', err);
  });