const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const expect = require('expect');

const Users = require('./Users');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'Todo';

// Create a new MongoClient
const client = new MongoClient(url,  { useNewUrlParser: true});

// Use connect method to connect to the Server
client.connect(function(err) {
  // assert.equal(null, err);
  expect(err).toBe(null);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  
  // inser datas into the Database
  Users(db, console.log);
  
  client.close();
});