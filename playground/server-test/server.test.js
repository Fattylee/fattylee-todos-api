const request = require('supertest');
const app = require('./server').app;

describe('Get route', () => {
  it('should test GET route /', (done) => {
  request(app)
  .get('/')
  .expect(200)
  .end(done);
});

});

