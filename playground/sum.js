module.exports.sum = (a, b) => {
  if (typeof a !== 'number') {
    return `Expected a 'number' but got a '${typeof a}'`;
  }
  else if (typeof b !== 'number') {
    return `Expected second argument to a 'number' but got a '${typeof b}'`;
  }
  else if (a <= 0) {
    return 'Expected first number to be greater than zero but got ' + a;
  }
	return a + b;
};

module.exports.square = (num) => num * num;