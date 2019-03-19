class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  print() {
    return `my name is ${this.name}, and age is ${this.age}.`;
  }
}

const fatai = new User('abdulFattaah', 31);
const abu = new User();

console.log(fatai.print());
console.log(abu.print());

console.log(JSON.stringify(fatai, null, 2));
console.log(JSON.stringify(abu, null, 2));

const Person = function (name = 'no name') {
  this.name = name;
};
Person.prototype.print= function () {
  return ('My name is ' + this.name)
}
Person.prototype.color = function (color = 'none') {
  return this.print() + ', and I love color ' + color;
}
const luqman = new Person();
console.log(luqman, luqman.color())