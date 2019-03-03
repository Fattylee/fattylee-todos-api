const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const Todo = require('./../model/Todo/Todo').Todo;


const app = require('../server');

const payload = [
{text: 'todo item 1', _id: new ObjectID()},
{text: 'todo item 2',  _id: new ObjectID()}
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
  describe('Home page route GET /', () => {
    it('should GET /', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect(res => {
        expect(res.text).toBe('<h1>Welcome to my Todo App, Have fun!</h1>')
      })
      .end(done);
  });
  });
  
  describe('GET /todos', () => {
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
  });
  });
  
  describe('GET /todos/:id', _ => {
    
  it('should get a todo by id: GET /todos/id', (done) => {
      const id = payload[0]._id.toHexString(); // no need to convert ObjectID to string using .toHexString() method
     
    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .then(todo => {
        expect(todo.body.todo.text).toBe(payload[0].text);
        done();
    }).catch(err => done(err));
     
  });
  
  
  it('should return 404 for invalid id: GET /todos/123', done => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end((err, res) => {
        if(err) return done(err);
          expect(res.body.message).toBe('Invalid todo id:123');
        done();
      });
  });
  
  it('should return 404 for todo not in the db: GET /todos/invalidID', done => {
    const validId = payload[0]._id;
    let invalidID = validId.toString();
    invalidID = invalidID.slice(0, invalidID.length - 3) + '123';
    
    // const hexId = new ObjectID();
    
    request(app)
      .get('/todos/' + invalidID)
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe('todo item not found: ' + invalidID);
      })
      .end(done);
  });
  });

  
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