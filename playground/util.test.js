const util = require('./util');
const expect = require('expect');


it('should add two numbers', () => {
  
  const a = 4, b = 5;
  const res = util.sum(a,b);
  
  expect(res).toBe(9);
  

  /* if (res !== 9) {
	  throw new Error('Expected 9 but got ' + res);
  } */
});

it('Should not take a number as the first argument', () => {
  const a = true, b=9;
  const res = util.sum(a, b);
  
  /*if(res !== `Expected a 'number' but got a '${typeof a}'`) {
    throw new Error(`does not expect 'number' as the first argument but got a '${typeof a}'`);
  }*/
  expect(a).toNotBeA('number');
});

it('Should not take a number as the second argument', () => {
  const a = {}, b=!!46;
  const res = util.sum(a, b);
  
  expect(b).toNotBeA('number');
  /*if(res !== `Expected second argument to a 'number' but got a '${typeof b}'`) {
    throw new Error(`does not expected a 'number' but got a '${typeof b}'`);
  }*/
});

it('Should take a number less than or equal zero as the first argument', () => {
  const a = -5, b=-78;
  const res = util.sum(a, b);
  
  if(res !== 'Expected first number to be greater than zero but got ' + a) {
    throw new Error('Expected first number to be less than zero but got ' + a);
  }
});

it('Should square a number', () => {
  const num = 5;
  const res = util.square(num);
  expect(res).toBe(25).toBeA('number')
  /*
  if (res !== 25) {
    throw new Error('Expect 25, but got ' + res);
  }*/
});

it('should set firstName and lastName', () => {
  const userObj = {
    location: 'lafemwa itele, Ogun state',
    age: 31,
  };
  const fullName = 'Fatai Balogun';
  const user = util.setName(userObj, fullName);
  
  expect(user).toInclude({
    firstName: 'Fatai',
    lastName: 'Balogun',
  })
  .toBeA('object')
  .toEqual(userObj)
  .toBe(userObj);
})