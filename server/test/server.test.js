const expect = require('expect');
const request = require('supertest');
const Todo = require('./../model/Todo/Todo').Todo;


const app = require('../server');


describe('GET routes', () => {
  it('should GET /', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });
  
  it('should get all todos GET /todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        
        Todo.find({
       //   _id: '5c7a5215acfff5567ecd9ad5',
       completed: true,
        })
          .then(res => {
            const size = res.length;
            expect(res.length).toBe(size);
            done();
          })
          .catch(err => done(err));
       
      })
  })
})

describe('POST routes', () => {
  it('should create a todo: POST /todos', (done) => {
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
  
  it('should not create a new todo: POST /todos', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) return done(err);
        
        //Todo.countDocuments().then(console.log)
        done();
      })
  })
})
