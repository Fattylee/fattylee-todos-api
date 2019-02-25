const request = require('supertest');
const expect = require('expect');
const app = require('./server').app;

describe('Get route', () => {
  it('should test GET route /', (done) => {
      request(app)
      .get('/')
      .expect(200)
      .end(done);
    });
 it('should GET /users', (done) => {
   request(app)
     .get('/users')
     .expect(200)
     .expect((res) => {
       expect(res.body).toInclude( {
    name: 'Abu Adnaan',
    age: 31,
  });
     })
     .end(done);
 })

  

});
