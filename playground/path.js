const path = require("path");

// console.log(process.exit(2));
const publicPath = path.join(__dirname, "../public");
const relativePath = path.join("./../public");
const argv = process.argv;

// console.log("direct public:", publicPath);
// console.log("relativePath:", relativePath);
// console.log("argv", argv);

// console.log(process.ppid, process.pid);
// setTimeout(() => console.log(process.uptime()), 2000);
// console.log(process.uptime());
// console.log(process.version);

const isValid = NaN;
const myPromise = () =>
  new Promise((res, rej) => {
    if (isValid) return res({ name: "fattylee", age: 33 });
    rej(Error("something went bad!"));
  });

myPromise()
  .then(console.log)
  .catch(console.log);

async function run() {
  try {
    bhsbh;
  } catch (ex) {
    console.log("exception");
    console.log(ex);
  }
}

run().catch((err) => {
  console.log("catch");
  console.log(err);
});
