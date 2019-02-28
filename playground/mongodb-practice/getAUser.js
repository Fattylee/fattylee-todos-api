const { ObjectID } = require('mongodb');
module.exports = (db, id) => {
  return db.collection('users').find({
    _id: new ObjectID(id),
  })
  .toArray()
  
  
};