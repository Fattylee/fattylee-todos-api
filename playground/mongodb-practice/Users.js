const assert = require('assert');

module.exports = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('users');
  // Insert some documents
  collection.insertMany([
    {
      name: 'Abu Adnaan',
      gender: 'male',
    }, 
    {
      name: 'Lukman Dev',
      gender: 'male',
    }, 
    {
      name: 'Ummu AbdilLah',
      gender: 'female',
    }
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}