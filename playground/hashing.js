//import  { Schema } from 'mongoose';

const {SHA256: hash } = require('crypto-js');
const bcrypt = require('bcryptjs');
const { verify, sign} = require('jsonwebtoken');

const message = 'I love coding';
const hashedMessage = hash(message);

//console.log('Message', message);
//console.log('Hash', JSON.stringify(hashedMessage, null, 2));
//console.log('HashToString', hashedMessage.toString());

const print = (...args) => {
  for (const arg of args) {
    //console.log(arg);
  }
};

let payload = {
  data: {
    id: 1,
  }
}
//payload = 'Abu Adnaan';

const secreteKey= 'I there';
print(verify(sign(payload, secreteKey), secreteKey), sign(payload, secreteKey), 5, 7);

const SchemaUser = new mongoose.Schema({});

//console.log(SchemaUser);

const myArr = [12, 45];
const newArr = myArr.concat([56, 20], ['farisco']);
const arrPush = myArr.push(45, 67);

// console.log(myArr, newArr, 'arrPush', arrPush);
const pass = true;
/*
const promise = new Promise((resolve, reject) => {
  if(pass)
  resolve({id: 1});
  else reject('Something went wrong');
});

promise
  .then(res => {
  console.log('Promise resolved', res);
  return {res, age: 31};
})
  .then( data => {
    console.log('my second data', data);
  })
  .catch(err => {
    console.log('Promise rejected', err);
  });
 */
 const getJSON = () => {
   return new Promise((resolve, reject) => {
     if(pass) return resolve({username: 'fattylee', age: 31});
     reject({message: 'An error occured', error: {username: 'invalid'}});
   });
 };
 
 let makeRequest = () => {
   getJSON()
     .then(data => {
       //console.log(data);
       return "done";
       }).then(console.log)
 };

makeRequest = async () => {
  //console.log(await getJSON());
  return 'done';
};

//console.log(makeRequest().then(console.log));

async function fn() {
  return 5;
}
function fab() {
  return new Promise((resolve, reject) => {
    if(pass) return resolve(45);
    reject('error in promise');
  });
};

async function getPro() {
  return fab().then(res => {
    //console.log('resolve', res);
    return res;
  });
};

async function map() {
  return 6;
}
//console.log(map())//.then(console.log))

//console.log(getPro().then(console.log));


//console.log(fn())
//fn().then(console.log)

const password = 'abu Adnaan';
bcrypt.genSalt(10).then( salt => {
  console.log('salt', salt);
  bcrypt.hash(password, salt).then( hash => {
    console.log('hash1:', hash);
    bcrypt.compare(password, hash).then(console.log)
  })
})
bcrypt.hash(password, 10).then(hash =>{
  console.log('hash2:', hash);
  bcrypt.compare(password, hash).then(console.log)
})