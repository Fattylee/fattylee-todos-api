const request = require('supertest');
const app = require('./server').app;

it('should test GET route /', (done) => {
  request(app)
  .get('/')
  .expect(200)
  .end(done);
});

console.log(' was here');