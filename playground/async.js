//'use strict'
async function Main() {
  async function asyncThrows(id) {
    return new Promise((res, rej) => {
      console.log(`ASYNC ERROR ${id}`)
      throw (`ASYNC ERROR ${id}`)
      
    })
  }
  try {
    // ASYNC ERROR 1
    // ASYNC ERROR 1 CAUGHT
    // OK
    
    const a = asyncThrows(11)
    //const b = asyncThrows(5)
    await a ;
  }
  catch(e) {
    console.log(e, 'CAUGHT')
    //return 'ERROR OK'
  }
  try { await asyncThrows(6)} catch( err ) {console.log(err, 'CAUGHT 2')}
  return 'main OK'
}
/*
Main()
  .then((r) => console.log(r))
  .catch((e) => console.error(e));
  */
 
const numbers = [true, 5, 'hi', 1, 2, 3, 4];

const sum = numbers.reduce((acc, number) => acc + number);

console.log('(reduce)sum =', sum);

var pilots = [
  {
    id: 10,
    name: "Poe Dameron",
    years: 14,
  },
  {
    id: 2,
    name: "Temmin 'Snap' Wexley",
    years: 30,
  },
  {
    id: 41,
    name: "Tallissan Lintra",
    years: 16,
  },
  {
    id: 99,
    name: "Ello Asty",
    years: 22,
  }
];

const totalYears = pilots.reduce((acc, pilot) => acc + pilot.years, 0);

console.log('total years of experience:', totalYears);

const mostExperience = pilots.reduce((mostP, pilot) => ((mostP.years || 0) > pilot.years) ?  mostP : pilot);

console.log('mostExperience pilot:', JSON.stringify(mostExperience, null, 2));

var personnel = [
  {
    id: 5,
    name: "Luke Skywalker",
    pilotingScore: 98,
    shootingScore: 5,
    isForceUser: true,
  },
  {
    id: 82,
    name: "Sabine Wren",
    pilotingScore: 73,
    shootingScore: 99,
    isForceUser: false,
  },
  {
    id: 22,
    name: "Zeb Orellios",
    pilotingScore: 20,
    shootingScore: 5,
    isForceUser: false,
  },
  {
    id: 15,
    name: "Ezra Bridger",
    pilotingScore: 43,
    shootingScore: 6,
    isForceUser: true,
  },
  {
    id: 11,
    name: "Caleb Dume",
    pilotingScore: 71,
    shootingScore: 8,
    isForceUser: true,
  },
];

let sumOfShootingScore = personnel.reduce((acc, person) => acc + ((person.isForceUser || 0) && person.shootingScore), 0);

sumOfShootingScore = personnel.reduce((acc, person) => person.isForceUser ? person.shootingScore + acc: acc, 0);


console.log('sumOfShootingScore:', sumOfShootingScore);

const personObject = {
  name: 'Abu Adnaan',
  isMarried: true,
};

const { age = 31, name, isMarried: m } = personObject;

console.log('Age:', age, '\nName:', name, '\nMarital Status:', m);

const nonUniqueNumbers = [12, 3,3,6,7,1,1];
const copy = [...nonUniqueNumbers, 67]
nonUniqueNumbers.push(0);
const uniqueNumbers = new Set(nonUniqueNumbers);
const removeFirstTwoElement = [...nonUniqueNumbers].slice(2);

console.log('nonUniqueNumbers:', nonUniqueNumbers);
console.log('uniqueNumbers Set:', uniqueNumbers);
console.log('uniqueNumbers Array:', Array.from(uniqueNumbers));
console.log('removeFirstTwoElement:', removeFirstTwoElement);
console.log('copy:', copy);
console.log('personObject:', personObject);

try {
  
  console.log('frozen personObject:', Object.freeze(personObject));
  Object.seal(personObject);
} catch(err) {console.log('ERROR here:', err)}

personObject['sex'] = 'male';
console.log('personObject:', personObject);

const cat = {
lives: 9,
jumps(){ 
cat.lives--; // this does not exist use jumps() {this.lives--}
}
}
const kitty = {...cat};
kitty.jumps();
// cat.jumps = function () { this.lives--}
cat.jumps(); 
console.log('cat lives b4 jump:', cat.lives);

console.log('cat lives after jump:', kitty.lives)