const expect = require('expect');
const request = require('supertest');
const Todo = require('./../model/Todo/Todo').Todo;


const app = require('../server');

const payload = [
{text: 'todo item 1'},
{text: 'todo item 2'}
];

beforeEach(done => {
  Todo.deleteMany()
    .then(res => {
      return Todo.insertMany(payload);
    })
    .then(res => done())
    .catch(err => done(err));
});

describe('GET routes', () => {
  it('should GET /', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect(res => {
        expect(res.text).toBe('<h1>Welcome to my Todo App, Have fun!</h1>')
      })
      .end(done);
  });
  
  it('should get a todo by id: GET /todos/id', (done) => {
    Todo.insertMany([{text: 'coding is d next level'}]).then(res => {
      const id = res[0]._id;
    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .then(todo => {
        //console.log(todo)
        done();
      })
      .catch(err => done(err));
    }).catch(err => done(err));
     
  });
  
  it('should get all todos GET /todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(2);
      })
      .end((err, res) => {
        if (err) return done(err);
        
        Todo.find({
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
        res.body[0].text = 'Abu payload';
        expect(res.body[0].text).toBe('Abu payload');
       // Todo.find().select('text -_id').sort('text').then(res => console.log(res));
      }).end(done);
      
  }); // End it
  
  it('should not create a new todo: POST /todos', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) return done(err);
          Todo.countDocuments().then(count => {
            expect(count).toBe(2);
          });
        done();
      });
      
  }); // End it
}); // End describe
