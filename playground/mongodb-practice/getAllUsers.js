const assert = require('assert');

module.exports = (db, filter, callback) => {
  // Get the documents collection
  const collection = db.collection('users');
  // Find some documents
  collection.find(filter).toArray((err, docs) => {
    assert.equal(err, null);
    console.log("Found the following records");
    // console.log(docs)
    callback(docs);
  });
}