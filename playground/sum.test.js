const math = require('./sum');



it('should add two numbers', () => {
  /*if(typeof a !== 'number') {
    throw new Error(`Expected first number to be a 'number' but got '${typeof a}'`)
  }
  else if(typeof b !== 'number') {
    throw new Error(`Expected second number to be a 'number' but got '${typeof b}'`);
  }
  else */
  const a = 4, b = 5;
  const res = math.sum(a,b);

  if (res !== 9) {
	  throw new Error('Expected 9 but got ' + res);
  }
});

it('Should not take a number', () => {
  const a = '4', b=9;
  const res = math.sum(a, b);
  
  if(res !== `Expected a 'number' but got a '${typeof a}'`) {
    throw new Error(`does not expected a 'number' but got a '${typeof a}'`);
  }
});

it('Should not take a number as the second argument', () => {
  const a = 5, b=true;
  const res = math.sum(a, b);
  
  if(res !== `Expected second argument to a 'number' but got a '${typeof b}'`) {
    throw new Error(`does not expected a 'number' but got a '${typeof b}'`);
  }
});

it('Should take a number less than or equal zero as the first argument', () => {
  const a = -5, b=-78;
  const res = math.sum(a, b);
  
  if(res !== 'Expected first number to be greater than zero but got ' + a) {
    throw new Error('Expected first number to be less than zero but got ' + a);
  }
});

it('Should square a number', () => {
  const num = 5;
  const res = math.square(num);
  
  if (res !== 25) {
    throw new Error('Expect 25, but got ' + res);
  }
})
