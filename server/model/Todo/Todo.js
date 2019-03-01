const mongoose = require('../../mongoose');

const Todo = mongoose.model('Todos', {
  text: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
  },
 completed: {
   type: Boolean,
   default: false,
 },
 completedAt: Number,
});

module.exports = {
  Todo,
};