const assert = require('assert');

module.exports = function(db, users, callback) {
  // Get the documents collection
  const collection = db.collection('users');
  // Insert some documents
  collection.insertMany(users, function(err, result) {
    console.log('error here:', err)
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}