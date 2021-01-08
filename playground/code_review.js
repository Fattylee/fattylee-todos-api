// process.argv | yargs.argv from yargs
// the former is from node inbuilt process while the latter is from npm modules which is far better!

const fs = require("fs");

fs.writeFileSync("my_list.json", JSON.stringify({ abu: "lulu" }));

const res = fs.readFileSync("my_list.json");

console.log(res);
console.log(JSON.parse(res));

console.log("end of line");
