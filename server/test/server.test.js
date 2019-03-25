const app = require('../server');
const jwt = require('jsonwebtoken');

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const Todo = require('./../models/todo').Todo;
const User = require('./../models/user').User;
const { format } = require('../../helpers/utils');

const { userPayload, todoPayload, populateDB } = require('./seed/seed');


beforeEach(populateDB);

describe('Home page route GET /', () => {
    it('should GET /', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  }); // end it
}); //end Home page

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
  }); // end it
}); //End GET /todos

describe('GET /todos/:id', () => {
  it('should get a todo by id: GET /todos/id', (done) => {
      const id = todoPayload[0]._id.toHexString();
      request(app)
        .get(`/todos/${id}`)
        .expect(200)
        .then(todo => {
          expect(todo.body.todo.text).toBe(todoPayload[0].text);
          done();
          }).catch(err => done(err));
  }); // end it
  
  it('should return 404 for invalid id: GET /todos/123', done => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end((err, res) => {
        if(err) return done(err);
          expect(res.body.message).toBe('Invalid todo id:123');
        done();
      });
  }); //end it
  
  it('should return 404 for todo not in the db: GET /todos/validID', done => {
    const validID = new ObjectID().toString();
    request(app)
      .get('/todos/' + validID)
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe('todo item not found: ' + validID);
      })
      .end(done);
  }); // end it
}); // end GET /todos/:id

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
      })
      .end(done);
      }); // end it
      
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
  }); // end it
  
}); // end POST /todos

  describe('DELETE /todos/id', () => {
    it('should delete a todo: DELETE /todos/id', (done) => {
      const { _id } = todoPayload[0];
      request(app)
        .delete('/todos/' + _id)
        .expect(200)
        .end((err, res) => {
          if(err) return done(err);
           expect(res.body._id).toBe(_id.toString());
          done();
        });
    }); // end it
    
    it('should not delete a todo with invalidID: DELETE /todos/id', (done) => {
      request(app)
        .delete('/todos/123')
        .expect(400)
        .end((err, res) => {
          if(err) return done(err);
          
          expect(res.body.message).toBe('Invalid todo id');
          done();
        });
    }); // end it
    
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
});// End DELETE todos/:id

describe('PATCH /todos/id', () => {
  it('should update a todo succesdully: PATCH /todos/id', (done) => {
    request(app)
      .patch('/todos/' + todoPayload[0]._id)
        .send({ completed: true, text: 'visit the masjid by 12noon' })
        .expect(200)
        .end((err, res) => {
          if(err) return done(err);
          
          expect(res.body.todo.completed).toBeTruthy();
          expect(res.body.todo.text).toMatch(/VISIT/i);
          expect(res.body.todo.completedAt).toBeGreaterThan(0);
          done();
        });
    }); // end it
    
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
    }); // end it
    
    it('should return 404 for todoId that is not in the db: PATCH /todos/id', (done) => {
      request(app)
        .patch('/todos/' + new ObjectID().toHexString())
        .expect(404)
        .expect( res => {
          expect(res.body.message).toMatch(/not found/);
        })
        .end(done);
    }); // end it
    
    it('should clear completedAt when todo is not completed', (done) => {
      request(app)
        .patch('/todos/' + todoPayload[0]._id)
        .send({ completed: false })
        .expect(200)
        .expect( res => {
          expect(res.body.todo.completedAt).toBe(null);
        })
        .end(done);
    }); // end it
    
    it('should return completedAt greater than zero when todo is completed', (done) => {
      request(app)
        .patch('/todos/' + todoPayload[0]._id)
        .send({ completed: true })
        .expect(200)
        .expect( res => {
          expect(res.body.todo.completedAt).toBeGreaterThan(0);
        })
        .end(done);
    }); // end it
}); // End PATCH todos/:id

describe('GET /users', () => {
    it('should get all users: GET /users', (done) => {
      request(app)
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body.users.length).toBe(2);
          //expect(res.body.users[0].tokens).toEqual(expect.arrayContaining(userPayload[0].tokens));
        })
        .end(done);
    }); // end it
    
}); // end GET /users


describe('DELETE /users', () => {
  it('should delete all users in the db: DELETE /users', (done) => {
    request(app)
      .delete('/users' )
        .expect(200)
        .end((err, res) => {
          if(err) return done(err);
          
          expect(res.body.message).toBe('all users deleted');
          done();
        });
    }); // end it
}); // end DELETE /users

describe('POST /users', () => {
  let counter = 0;
  beforeEach(async () => {
    try {
      await Promise.all([
      Todo.deleteMany(), User.deleteMany()]).catch( err => { throw err });
      const all = await  Promise.all([
        Todo.insertMany(todoPayload), 
        new User(userPayload[0]).save(),
        new User(userPayload[1]).generateAuthUser(),
        ]).catch( err => { throw err });
      //console.log('all:', ++counter,  all[1], '\n==========', all[2]);
    } catch( err ) { console.error(err); }
    });

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
           expect(data.length).toBe(3);
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
            expect(count).toBe(2);
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
            expect(count).toBe(2);
            done();
          }).catch( err => done(err));
      });
      
  }); // End it
  it('should not create a new user when email already exist: POST /users', (done) => {
    const payload = { 
    email: userPayload[0].email,
    password: '1235gsvs',
    };
    request(app)
      .post('/users')
      .send(payload)
      .expect(409)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.error).toBe('email already exist');
        expect(res.body.error).toBeTruthy();
        User.countDocuments()
        .then( count => {
          expect(count).toBe(2);
          done();
        }).catch( err => done(err));            
      });
      
  }); // End it
}); // End POST /users 

describe('AUTH Route: GET /users/abu', () => {
  let counter = 0, token;
  /*
  beforeEach(async () => {
      try {
        
        let res = await User.deleteMany().catch( err => { throw err });
        const users = [
      {email: 'abdullah@gnail.com', 'password': '123hag4hello'}, 
      {email: 'fattylee@gnail.com', 'password': '1234hello'}
      ];
        const user1 = new User(users[0]).generateAuthUser();
        const user2 = new User(users[1]).generateAuthUser();
       res = await Promise.all([user1, user2]).catch( err => { throw err });
      
       res = await User.find().catch(err => { throw err });
        
      ( [{tokens: [{token}]}] = res );
      }
      catch (err) { console.error(err); }
      
    });*/

  it('should return authenticated user', async () => {
    const [{ tokens: [{token}]}] = userPayload;
    request(app)
      .get('/users/abu')
      .set('x-auth', token)
      .expect(200)
      .end((err, user) => {
        if(err) {
          return console.error(err);
        }
         expect(user.body.email).toBe('abc@gmail.com');
      });
  }); // end it
  it('should not return user wen header is not set', async () => {
    request(app)
      .get('/users/abu')
      .expect(401)
      .end((err, user) => {
        if(err) {
          return console.error(err);
        }
        expect(user.body.error[0].message).toBe('"x-auth Header" is required')
      });
  }); // end it
  it('should not return user wen header is set to empty', async () => {
    request(app)
      .get('/users/abu')
      .set('x-auth', '')
      .expect(401)
      .end((err, user) => {
        if(err) {
          return console.error(err);
        }
        expect(user.body.error[0].message).toBe('"x-auth Header" is not allowed to be empty')
      });
  }); // end it
  it('should return 404 for a valid token that is not in the db', async () => {
    const token = jwt.sign({access: 'auth', _id: new ObjectID()}, 'haleemah123');
    request(app)
      .get('/users/abu')
      .set('x-auth', token)
      .expect(404)
      .end((err, user) => {
        if(err) {
          return console.error(err);
        }
        expect(user.body.message).toBe('user not found')
      });
  }); // end it
  it('should return 401 for a invalid token', async () => {
    const token = jwt.sign({access: 'auth', _id: new ObjectID()}, 'haleemah123').toString().slice(1);
    request(app)
      .get('/users/abu')
      .set('x-auth', token)
      .expect(401)
      .end((err, user) => {
        if(err) {
          return console.error(err);
        }
        expect(user.body.message).toBe('invalid token')
      });
  }); // end it
  it('should return 401 for a invalid token 344yyhh of shorter length', async () => {
    const token = '344yyhh';
    request(app)
      .get('/users/abu')
      .set('x-auth', token)
      .expect(401)
      .end((err, user) => {
        if(err) {
          return console.error(err);
        }
        expect(user.body.message).toBe('jwt malformed')
      });
  }); // end it

}); // end GET /users/abu

describe('404 Error Page', () => {
  it('should redirect to 404 Error Page for unknown route', () => {
    request(app)
     .get('/popcorn')
     .expect(302)
     .end((err, res) => {
       if(err) return console.error(err);
     });
  }); // end it
}); // end 404 Error Page