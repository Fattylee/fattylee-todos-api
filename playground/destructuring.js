const simpleObject = {
  a: 5,
  b: 'this is b',
  c: {
    cc: 5,
    dd: {
      dog: 'forbidden',
      arr: [20, [{age: 31}]]
    }
  },
 d: [23, 56, true, 'baba', ['sex', {map: 5, sex: 'male' }]]
};
let a, b, cc, d;
({a, b, c: {cc : text}, c: {dd: {dog}}, d:[first, ...rest], c: {dd: {arr: [, age]}}, d: [,,,,[, {sex=78}]]} = simpleObject);
//console.log('a:', a, 'b:', b, 'cc:', cc, 'text:', text, 'dog:', dog, 'd:', first, rest, 'second:', age, 'sex:', sex);

const str = 'random string what is it';
const regex = /(.*)[\s]+(is)[\s]+([\w]+)/i;

let result = regex.exec(str);

//console.log('result:', result);
let userPayload = {
  name: 'Abu Adnaan',
  man: function() {
    return (userPayload.name)
  },

}

console.log(userPayload.man());