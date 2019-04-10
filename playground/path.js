const path = require('path');

const publicPath = path.join(__dirname, '../public');
const relativePath = path.join('./../public');

console.log('direct public:', publicPath);
console.log('relativePath:', relativePath);