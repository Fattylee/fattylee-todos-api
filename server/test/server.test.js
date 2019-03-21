const app = require('../server');
const jwt = require('jsonwebtoken');

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const Todo = require('./../models/todo').Todo;
const User = require('./../models/user').User;


const payload = [
{text: 'todo item 1', _id: new ObjectID(), completed: true, completedAt: Date.now() },
{text: 'todo item 2',  _id: new ObjectID()}
];

const userPayload = [
  { 
  __v: 0,
  email: 'abc@gmail.com',
  password: '12344671',
  _id: new ObjectID(),
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: new ObjectID(), access: 'auth'}, 'mamama12'),
    _id: new ObjectID(),
    }]  
  }
];

beforeEach(async () => {
  try {
    await Todo.deleteMany().catch( err => { throw err });
    await User.deleteMany().catch( err => { throw err });
    await Todo.insertMany(payload).catch( err => { throw err });
    await User.insertMany(userPayload).catch( err => { throw err });
  } catch( err ) { console.error(err); }
 
});

describe('GET routes', () => {
  describe('Home page route GET /', () => {
    it('should GET /', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });
  });
  
  describe('GET /todos', () => {
    it('should get all todos GET /todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
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
  
  describe('GET /users', () => {
    it('should get all users: GET /users', (done) => {
      request(app)
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body.users.length).toBe(1);
          //expect(res.body.users[0].tokens).toEqual(expect.arrayContaining(userPayload[0].tokens));
          
        })
        .end(done);
    })
  })

  
})

describe('POST routes', () => {
  describe('POST /todos', () => {
  it('should create a todo: POST /todos', (done) => {
    const payload = {
      text: 'look for kali-termux'
    };
    request(app)
      .post('/todos')
      .send(payload)
      .expect(201)
      .expect((res) => {
        res.body.text = 'Abu payload';
        expect(res.body.text).toBe('Abu payload');
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
            done();
          }).catch( err => done(err));
      });
      
  }); // End it
  }); // End describe todos
  describe('POST /users', () => {
    it('should create a user: POST /users', (done) => {
    const payload = {
      email: 'absc@yahoo.COM',
      password: 'password12',
    };
    request(app)
      .post('/users')
      .send(payload)
      .expect(201)
      .end((err, res) => {
        if(err) return done(err);
       
       expect(res.header['x-auth']).toBeTruthy(); expect(res.body.email).toBe('absc@yahoo.com');
        
         User.find().then( data => {
           expect(data.length).toBe(2);
           done();
         }).catch( err => done(err));
      });
  }); // End it
  it('should not create a new user when payload is empty: POST /users', (done) => {
    request(app)
      .post('/users')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) return done(err);
        
        expect(res.body.message).toBe('Invalid input');
        expect(res.body.error.length).toBe(2);
          User.countDocuments().then(count => {
            expect(count).toBe(1);
            done();
          }).catch( err => done(err));
      });
      
  }); // End it
  it('should not create a new user when email is invalid: POST /users', (done) => {
    const payload = { 
    email: 'abcgmail.com',
    password: '1235gsvs',
    };
    request(app)
      .post('/users')
      .send(payload)
      .expect(400)
      .end((err, res) => {
        if(err) return done(err);
        
        expect(res.body.message).toBe('Invalid input');
        expect(res.body.error[0].message).toMatch('must be a valid email')
        expect(res.body.error.length).toBe(1);
          User.countDocuments().then(count => {
            expect(count).toBe(1);
            done();
          }).catch( err => done(err));
      });
      
  }); // End it
  it('should not create a new user when email already exist: POST /users', async () => {
    const payload = { 
    email: userPayload[0].email,
    password: '1235gsvs',
    };
    request(app)
      .post('/users')
      .send(payload)
      .expect(409)
      .end(async (err, res) => {
        if(err) return console.error(err);
        expect(res.body.error).toBe('email already exist');
        expect(res.body.error).toBeTruthy();
          const count = await User.countDocuments().catch( err => console.error(err));
            expect(count).toBe(1);
      });
      
  }); // End it
  
  }); // End describe users 
}); // End describe POST

describe('DELETE route', () => {
  describe('DELETE /todos/id', () => {
    it('should delete a todo: DELETE /todos/id', (done) => {
      const { _id } = payload[0];
      request(app)
        .delete('/todos/' + _id)
        .expect(200)
        .end((err, res) => {
          if(err) return done(err);
           expect(res.body._id).toBe(_id.toString());
          done();
        });
    });
    
    it('should not delete a todo with invalidID: DELETE /todos/id', (done) => {
      request(app)
        .delete('/todos/123')
        .expect(400)
        .end((err, res) => {
          if(err) return done(err);
          
          expect(res.body.message).toBe('Invalid todo id');
          done();
        });
    });
    
    it('should not delete a todo for a todo not in the db: DELETE /todos/id', (done) => {
      const _id = new ObjectID();
      request(app)
        .delete('/todos/' + _id)
        .expect(404)
        .end((err, res) => {
          if(err) return done(err);
          
          expect(res.body.message).toBe('Todo not found');
          done();
        });
    }); // End it
  });// End describe DELETE todos
  
  describe('DELETE users', () => {
    it('should delete all users in the db: DELETE /users', (done) => {
      request(app)
        .delete('/users' )
        .expect(200)
        .end((err, res) => {
          if(err) return done(err);
          
          expect(res.body.message).toBe('all users deleted');
          done();
        });
    }); // End it
  }); // End describe DELETE users
}); // End describe DELETE

describe('PATCH route', () => {
  describe('PATCH /todos/id', () => {
    it('should update a todo succesdully: PATCH /todos/id', (done) => {
      request(app)
        .patch('/todos/' + payload[0]._id)
        .send({ completed: true, text: 'visit the masjid by 12noon' })
        .expect(200)
        .end((err, res) => {
          if(err) return done(err);
          
          expect(res.body.todo.completed).toBeTruthy();
          expect(res.body.todo.text).toMatch(/VISIT/i);
          expect(res.body.todo.completedAt).toBeGreaterThan(0);
          done();
        })
    })
    
    it('should return 404 for invalid todoId: PATCH /todos/123', (done) => {
      request(app)
        .patch('/todos/123')
        .expect(400)
        .then(res => {
          expect(res.body.message).toContain('Invalid');
          expect(null).toBeNull();
          done();
        })
        .catch( err => done(err));
    });
    
    it('should return 404 for todoId that is not in the db: PATCH /todos/id', (done) => {
      request(app)
        .patch('/todos/' + new ObjectID().toHexString())
        .expect(404)
        .expect( res => {
          expect(res.body.message).toMatch(/not found/);
        })
        .end(done);
    });
    
    it('should clear completedAt when todo is not completed', (done) => {
      request(app)
        .patch('/todos/' + payload[0]._id)
        .send({ completed: false })
        .expect(200)
        .expect( res => {
          expect(res.body.todo.completedAt).toBe(null);
        })
        .end(done);
    });
    
    it('should return completedAt greater than zero when todo is completed', (done) => {
      request(app)
        .patch('/todos/' + payload[0]._id)
        .send({ completed: true })
        .expect(200)
        .expect( res => {
          expect(res.body.todo.completedAt).toBeGreaterThan(0);
        })
        .end(done);
    }); // End it
  }); // End describe PATCH todos
}); // End describe patch

describe('404 Error Page', () => {
  it('should redirect to 404 Error Page for unknown route', () => {
    request(app)
     .get('/popcorn')
     .expect(302)
     .end((err, res) => {
       if(err) return console.error(err);
     });
  })
})