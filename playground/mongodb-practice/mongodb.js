const { MongoClient, ObjectID } = require('mongodb');
const assert = require('assert');
const expect = require('expect');
const faker = require('faker');

const insertUsers = require('./insertUsers');
const getAllUsers = require('./getAllUsers');
const getAUser = require('./getAUser');
const update = require('./update');
const updateMany = require('./updateMany');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Nameq
const dbName = 'Todo';

// Create a new MongoClient
const client = new MongoClient(url,  { useNewUrlParser: true});

//payload
const users = [
    {
      name: faker.name.findName(),
      gender: (faker.random.number() % 2) ? 'male' : 'female',
      //age: faker.random.number(),
    }, 
    {
      name: faker.name.findName(),
      gender: (faker.random.number() % 2) ? 'male' : 'female',
      age: faker.random.number(),
    }, 
    {
      name: faker.name.findName(),
      gender: (faker.random.number() % 2) ? 'male' : 'female',
      age: faker.random.number(),
    }
  ];
  
// Use connect method to connect to the Server
client.connect(function(err) {
  // assert.equal(null, err);
  expect(err).toBe(null);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  
  /*
  // inser datas into the Database
   insertUsers(db, users, (res) => {
    console.log(res);   
    
    // client.close();
  }); // End Insert user
  */
  
  
    // get all users
    getAllUsers(db, 
    {$and: [
      {age: {$exists: false}},
      //{gender: {$ne: 'male'}}
    ]},
    (users) => {
      console.log(JSON.stringify(users, undefined, 2));
      console.log('Total Count:', users.length);
      
      // client.close();
    }); // End getAllUsers
    
    
    /*
    // get a single user by id
    getAUser(db, "5c7643e9cc29aa237034d9e7")
    .then(result => {
    console.log(JSON.stringify(result[0], undefined,2));
  })
  .catch(console.log); // End getAUser
  */
  
  
  /*
    //update a single  document
  update(db, '5c7643e9cc29aa237034d9e7',{
    name: 'ABU LULU',
    gender: 'male',
  })
    .then(console.log)
    .catch(console.log);
  */
  
  /*
  updateMany document
  updateMany(db, {gender: 'male\t'}, {gender: 'male'})
    .then(console.log)
    .catch(console.log);
  */
  
  /*
  // findOneAndDelete db.collection('users').findOneAndDelete({
    _id: new ObjectID("5c765885abfb2c45f8bce03c"),
  })
  .then(console.log)
  .catch(console.log);
  */
  
  /*
  // deleteMany from users collection
  db.collection('users').deleteMany(
    {
      /*
      age: {
      $eq: 6202,
      $exists: !!'g'
      } */
      /*
      $and: [
      {name: 'Walton Von'},
      {gender: 'male'}
      ]
      */
      
      /*
      //matches document where gender equal 'male' AND age is greater than 20000 AND less than 50000
      $and: [
      {gender: 'male'},
      {age: {$lt: 50000, $gt: 20000}}
      ]
      
      age
    })
   .then((res) => console.log('deletedCount:', res.deletedCount))
  .catch(console.log);
*/
  
}); // End client connect