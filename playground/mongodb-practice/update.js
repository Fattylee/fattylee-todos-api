const ObjectID = require('mongodb').ObjectID;

module.exports = (db, id, user) => {
  return db.collection('users').findOneAndUpdate(
  {_id: new ObjectID(id)},
  {
    $set: user,
   // $unset: {age: 89, name: 'ummu', gender:'other'}
  },
  {
    returnOriginal: false
  }
  ); 
} 