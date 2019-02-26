const sumOne = (a,b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a+b);
    }, 3000); //End setTimeout after 1s
  }); // End Promise
}; // End sumOne

const sumTwo = (a,b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a+b);
    }, 4000); //End setTimeout after 1s
  }); // End Promise
}; // End sumOne

const printTime = (start, end) => {
  const timeSpent = (end - start) / 1000;
  console.log('Timestamp:', timeSpent + 's');
  return timeSpent;
}
const getSums = async () => {
  const start = Date.now();
  printTime(start, Date.now());
  const sum1 = await sumOne(2,3);
  printTime(start, Date.now());
  const sum2 = await sumTwo(67,2);
  printTime(start, Date.now());
  console.log(`sum1 = ${sum1}\nSum2 = ${sum2}. -- Timestamp: ${printTime(start, Date.now())}`);
  printTime(start, Date.now());
}

const getSumPromiseAll = async () => {
  const start = Date.now();
  printTime(start, Date.now());
  const [sum1, sum2] = await Promise.all([sumOne(20,5), sumTwo(67,3)]);
  printTime(start, Date.now());
  console.log(`sum1 = ${sum1}\nSum2 = ${sum2}. -- Timestamp: ${printTime(start, Date.now())}`);
}
//getSums();
//console.log('=================');
getSumPromiseAll();