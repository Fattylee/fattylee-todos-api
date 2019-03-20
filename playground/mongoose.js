const mongoose = require('mongoose');

const format = (obj) => JSON.stringify(obj, null, 2);


mongoose.connect('mongodb://localhost/TestM', { useNewUrlParser: true });

const db = mongoose.connection; 
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function() { // we're connected! 
console.log('hurray connected!');

const kittySchema = new mongoose.Schema({ name: String });

kittySchema.methods.toJSON = function () {
  const kittyObject = this//.toObject();
  console.log('this is toJSON method', kittyObject);
  const { name, username = 'fattylee', _id: id } = kittyObject;
  return 5;// {name, username, id};
 };
  
kittySchema.methods.print = function(age = 31) {
  return 'My name is ' + this.name + ', and I\'m ' + age + ' years old';
};

const Kitten = mongoose.model('Kitten', kittySchema);

const silence = new Kitten({ name: 'Silence' });

console.log(format(silence)); // 'Silence' 
//console.log(silence.print(11));
//console.log(silence.toJSON())

silence.save().then( s => {
  //console.log('saved!:', s, format(s));
  
  });



});
