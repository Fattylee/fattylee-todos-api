const expect = require('expect');
const request = require('supertest');

const app = require('../server');


describe('GET routes', () => {
  it('should GET /', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  })
})

describe('POST routes', () => {
  it('should POST /todos', (done) => {
    const payload = {
      text: 'look for kali-termux'
    };
    request(app)
      .post('/todos')
      .send(payload)
      .expect(201)
      .expect((res) => {
        expect(res.body.text).toBe(payload.text);
      })
      .end((err, res) => {
        if (err) return done(err);
        // console.log(res.body);
        done();
      });
  })
})
