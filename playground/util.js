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
	return a + b ;
};

module.exports.square = (num) => num * num;

module.exports.setName = (user, fullName) => {
  user.firstName = fullName.split(' ')[0];
  user.lastName = fullName.split(' ')[1];

  return user;
};

module.exports.asyncSum = (a,b, callBack) => {
  setTimeout(() => {
    callBack(a + b);
  }, 1500);
};