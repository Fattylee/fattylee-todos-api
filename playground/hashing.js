const mongoose = require('mongoose');
const {SHA256: hash } = require('crypto-js');
const bcrypt = require('bcryptjs');
const { verify, sign} = require('jsonwebtoken');

const message = 'I love coding';
const hashedMessage = hash(message);
Object.prototype.toString = function() {
  const obj = this;
  if(obj.name) return obj.name;
  return 'you\'re hacked!';
};
const custObj = { name: 'Abu Adnaan' };
const person = { age: 31 };
console.log('custObj type:', typeof custObj, 'custObj string:', custObj.toString(), 'person obj toString:', person.toString());
//console.log('Message', message);
console.log('Hash', 'typeof hash:', typeof hashedMessage, JSON.stringify(hashedMessage, null, 2), 'string hash:', hashedMessage.toString());
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
let newArr = myArr.concat([56, 20], ['farisco']);
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


/*
let password = 'abu Adnaan';
bcrypt.genSalt(10).then( salt => {
 // console.log('salt', salt);
  bcrypt.hash(password, salt).then( hash => {
   // console.log('hash1:', hash);
  //  bcrypt.compare(password, hash).then(console.log)
  })
})
bcrypt.hash(password, 10).then(hash =>{
  //console.log('hash2:', hash);
 // bcrypt.compare(password, hash).then(console.log)
});


password = 'password12';
const hash1 = '$2a$10$0X3iTG6VsJwMijcMLNmXx.FMZOz1.Vgwtl.sG./gX/iEl8c3tHVwy';
const hash2 = '$2a$10$H8fwl5494i8ZfQVTtCwdfOPZCW4jGEm3UbItIAPKse.MURErN4nym';
const hash3 = '$2a$10$YlJi7OGb8tU43mQurH/CMucF9MAxWabP3.xn987uObERutmWL5sP2';

const hash4 = '$2a$10$io0DfkFHG/Qed5AF9DNkPuleZu.IgaO2QGzC9DBe7xst2JR.McbKa';

const hashAsync1 = '$2a$10$DArUku/pg5yLUkFaUuFgduYGJipADyMJslXGG6bKCJINf96BvU6tu';
const hashAsync2 = '$2a$10$F89IXy3FG9w5RBNsdFFbLeC.NucgxGBp7IKnrqzRRV9Nja.HcvjTC';

//sync
console.log('bcryptSync:', bcrypt.hashSync(password, 10));

//async
bcrypt.hash(password, 10).then( hash => {
  console.log('bcrypt async:', hash);
}).catch(console.error);

// asyn salt hash
bcrypt.genSalt(10)
.then(salt =>{
  return bcrypt.hash(password, salt);
})
.then( hash => {
  console.log('bcrypt async salt hash:', hash);
})
.catch(console.error);

console.log('compare with', hash1, bcrypt.compareSync(password, hash1));

console.log('compare with another', hash2, bcrypt.compareSync(password, hash2));


bcrypt.compare(password, hash3).then( res => {
  console.log('compare async', hash3, res);
}).catch(console.error);

bcrypt.compare(password, hash4).then( res => {
  console.log('compare async 4', hash4, res);
}).catch(console.error);

console.log('compare sync with hashAsync1:', hashAsync1, bcrypt.compareSync(password, hashAsync1));

console.log('compare sync with hashAsync2:', hashAsync2, bcrypt.compareSync(password, hashAsync2));

const password = 'loocer';
const h = bcrypt.hashSync(password, 11);
console.log(password, '<==>', h);
console.log('compare result:', bcrypt.compareSync('ggg', h));
console.log('last line');
*/
newArr = [1,2,3,4];
/*
console.log(newArr);
newArr.length = 0;
newArr.concat([5,6,7])

console.log(newArr.push(0,9,8))
newArr.push(...newArr)
*/
console.log(newArr.splice(0,newArr.length,...[5,6,7,8,]))
console.log(newArr)