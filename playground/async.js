//'use strict'
//
async function Main() {
  async function asyncThrows(id) {
    return new Promise((res, rej) => {
      console.log(`ASYNC ERROR ${id}`);
      throw `ASYNC ERROR ${id}`;
    });
  }
  try {
    // ASYNC ERROR 1
    // ASYNC ERROR 1 CAUGHT
    // OK

    const a = asyncThrows(11);
    //const b = asyncThrows(5)
    await a;
  } catch (e) {
    console.log(e, "CAUGHT");
    //return 'ERROR OK'
  }
  try {
    await asyncThrows(6);
  } catch (err) {
    console.log(err, "CAUGHT 2");
  }
  return "main OK";
}
/*
Main()
  .then((r) => console.log(r))
  .catch((e) => console.error(e));
  */

const numbers = [true, 5, "hi", 1, 2, 3, 4];

const sum = numbers.reduce((acc, number) => acc + number);

// console.log("(reduce)sum =", sum);

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
  },
];

const totalYears = pilots.reduce((acc, pilot) => acc + pilot.years, 0);

// console.log("total years of experience:", totalYears);

const mostExperience = pilots.reduce((mostP, pilot) =>
  (mostP.years || 0) > pilot.years ? mostP : pilot
);

// console.log("mostExperience pilot:", JSON.stringify(mostExperience, null, 2));

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

let sumOfShootingScore = personnel.reduce(
  (acc, person) => acc + ((person.isForceUser || 0) && person.shootingScore),
  0
);

sumOfShootingScore = personnel.reduce(
  (acc, person) => (person.isForceUser ? person.shootingScore + acc : acc),
  0
);

// console.log("sumOfShootingScore:", sumOfShootingScore);

const personObject = {
  name: "Abu Adnaan",
  isMarried: true,
};

const { age = 31, name, isMarried: m } = personObject;

// console.log("Age:", age, "\nName:", name, "\nMarital Status:", m);

const nonUniqueNumbers = [12, 3, 3, 6, 7, 1, 1];
const copy = [...nonUniqueNumbers, 67];
nonUniqueNumbers.push(0);
const uniqueNumbers = new Set(nonUniqueNumbers);
const removeFirstTwoElement = [...nonUniqueNumbers].slice(2);

// console.log("nonUniqueNumbers:", nonUniqueNumbers);
// console.log("uniqueNumbers Set:", uniqueNumbers);
// console.log("uniqueNumbers Array:", Array.from(uniqueNumbers));
// console.log("removeFirstTwoElement:", removeFirstTwoElement);
// console.log("copy:", copy);
// console.log("personObject:", personObject);

try {
  // console.log("frozen personObject:", Object.freeze(personObject));
  Object.seal(personObject);
} catch (err) {
  // console.log("ERROR here:", err);
}

personObject["sex"] = "male";
// console.log("personObject:", personObject);

const cat = {
  lives: 9,
  jumps() {
    cat.lives--; // this does not exist use jumps() {this.lives--}
  },
};
const kitty = { ...cat };
kitty.jumps();
// cat.jumps = function () { this.lives--}
cat.jumps();
// console.log("cat lives b4 jump:", cat.lives);

// console.log("cat lives after jump:", kitty.lives);

/*
 * Start my test func
 *
 */
const pg = require("pg");

const { Pool } = pg;
const pool = new Pool({
  // user: "fattylee",
  // database: "fattylee",
  // host: "127.0.0.1",
  password: "fattylee",
  port: "5433",
});

const createParent = () => {
  const sql = `
CREATE TABLE IF NOT EXISTS parents(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);
`;
  return pool.query(sql);
};

const createChild = () => {
  const sql = `
CREATE TABLE IF NOT EXISTS childs(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  owner int not null,
  FOREIGN KEY(owner) REFERENCES parents(id) ON DELETE CASCADE
);
`;
  return pool.query(sql);
};

const dropParent = () => {
  const sql = `
  DROP TABLE IF EXISTS parents;
`;
  return pool.query(sql);
};

const dropChild = () => {
  const sql = `
  DROP TABLE IF EXISTS childs;
`;
  return pool.query(sql);
};

const runMigration = async () => {
  try {
    const dropChildRes = await dropChild();
    console.log("dropChild:", dropChildRes.command);
    const dropParentRes = await dropParent();
    console.log("drdropParent:", dropParentRes.command);
    const createParentRes = await createParent();
    console.log("createParent:", createParentRes.command);
    const createChildRes = await createChild();
    console.log("createChild:", createChildRes.command);
    process.exit();
  } catch (ex) {
    console.log("displaying...errorr");
    console.log(ex);
    process.exit();
  }
};

const runMigrationTwo = () => {
  dropChild()
    .then((res) => {
      console.log("dropChild:", res.command);
      return dropParent();
    })
    .then((res) => {
      console.log("dropParent:", res.command);
      return createParent();
    })
    .then((res) => {
      console.log("createParent:", res.command);
      return createChild();
    })
    .then((res) => {
      console.log("createChild:", res.command);
      process.exit();
    })
    .catch((err) => {
      console.log("Displaying error...");
      console.log(err);
      process.exit();
    });
};

pool
  .query("select 1+1 as result")
  .then((res) => {
    console.log(res.rows);
    runMigrationTwo();
  })
  .catch((err) => {
    console.log("printing error");
    console.log(err);
  });

const fun1 = async () => {
  console.log("running fun1");
};
const fun2 = async () => Promise.reject({ status: "success", value: 20 });

const run = async () => {
  // try {
  const res2 = await fun2();
  console.log(res2);
  const res = await fun1();
  console.log(res);
  // } catch (ex) {
  //   console.log("logging exception");
  //   console.log(ex);
  // }
  // setTimeout(() => console.log(res2), 1000);
};

(async function() {
  try {
    const res = await run();
    console.log("run", res);
  } catch (ex) {
    console.log("logging exception");
    console.log(ex);
    console.log(ex.stack);
  }
})();

