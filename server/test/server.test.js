const app = require('../server');
const jwt = require('jsonwebtoken');

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const Todo = require('./../models/todo').Todo;
const User = require('./../models/user').User;
const { format } = require('../../helpers/utils');

const { userPayload, todoPayload, populateDB, plainPassword, plainPassword2 } = require('./seed/seed');


beforeEach(populateDB);

describe('Home page route GET /', () => {
    it('should GET /', async () => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if(err) return console.error(err);
      });
  }); // end it
}); //end Home page

describe('GET /todos', () => {
  it('should get all todos GET /todos', async () => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end((err, res) => {
        if (err) return console.error(err);
      });
  }); // end it
}); //End GET /todos

describe('GET /todos/:id', () => {
  it('should get a todo by id: GET /todos/id', async () => {
      const id = todoPayload[0]._id.toHexString();
      request(app)
        .get(`/todos/${id}`)
        .expect(200)
        .then(todo => {
          expect(todo.body.todo.text).toBe(todoPayload[0].text);
          //done();
          })
          .catch(err => console.error(err));
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
  it('should create a todo: POST /todos', async () => {
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
      .end((err, res) => {
        if(err) return console.error(err);
      });
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
  it('should update a todo succesdully: PATCH /todos/id', async () => {
    request(app)
      .patch('/todos/' + todoPayload[0]._id)
        .send({ completed: true, text: 'visit the masjid by 12noon' })
        .expect(200)
        .end((err, res) => {
          if(err) return console.error(err);
          expect(res.body.todo.completed).toBeTruthy();
          expect(res.body.todo.text).toMatch(/VISIT/i);
          expect(res.body.todo.completedAt).toBeGreaterThan(0);
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
        })
        .end(done);
    }); // end it
    
}); // end GET /users


describe('DELETE /users', () => {
  it('should delete all users in the db', (done) => {
    request(app)
      .delete('/users')
      .send({ key: process.env.SUPER_USER_KEY })
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.message).toBe('all users deleted');
          done();
        });
    }); // end it
    it('should not delete users in the db if key is not supplied', (done) => {
    request(app)
      .delete('/users')
      .expect(400)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.error[0].message).toEqual('"key" is required');
          done();
        });
    }); // end it
    it('should not delete users in the db if key is invalid', (done) => {
    request(app)
      .delete('/users')
      .send({ key: 'vvgvv' })
      .expect(401)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.error.message).toBe('Invalid key');
          done();
        });
    }); // end it
    
}); // end DELETE /users

describe('POST /users', () => {
   it('should create a user: POST /users', (done) => {
    const payload = {
      email: 'lakers@yahoo.COM',
      password: 'password12',
    };
    request(app)
      .post('/users')
      .send(payload)
      .expect(201)
      .then((res) => {
       
       expect(res.header['x-auth']).toBeTruthy(); expect(res.body.user.email).toBe('lakers@yahoo.com');
       User.find().then(data => {
         expect(data.length).toBe(3);
       expect(data[2].password).not.toBe(payload.password);
       done();
       }).catch( err => done(err));
      }).
      catch(done);
  }); // End it
  it('should not create a new user when payload is empty', async () => {
    request(app)
      .post('/users')
      .send()
      .expect(400)
      .end(async (err, res) => {
        if(err) return console.error(err);
        
        expect(res.body.message).toBe('Invalid input');
        expect(res.body.error.length).toBe(2);
        const users = await User.find().catch(console.error);
        expect(users.length).toBe(2);
      });
  }); // End it
  it('should not create a new user when email is invalid', async () => {
    const payload = { 
    email: 'abcgmail.com',
    password: '1235gsvs',
    };
    request(app)
      .post('/users')
      .send(payload)
      .expect(400)
      .end(async (err, res) => {
        if(err) return console.error(err);
        
        expect(res.body.message).toBe('Invalid input');
        expect(res.body.error[0].message).toMatch('must be a valid email')
        expect(res.body.error.length).toBe(1);
        const count = await User.countDocuments().catch(console.error);
        expect(count).toBe(2);
      });
  }); // End it
  it('should not create a new user when email already exist', (done) => {
    const [{email, password}] = userPayload;
    request(app)
      .post('/users')
      .send({email, password})
      .expect(409)
      .then(async (res) => {
        
          expect(res.body.error).toBe('email already exist');
        expect(res.body.error).toBeTruthy();
        const users = await User.find().catch(console.error);
        expect(users.length).toBe(2);     
        done();
      })
      .catch(done);
  }); // End it
   
}); // End POST /users 

describe('AUTH Route: GET /users/auth', () => {
  
  it('should not return user when header is not set', async () => {
    request(app)
      .get('/users/auth')
      .expect(401)
      .then((user) => {
        expect(user.body.error[0].message).toBe('"x-auth Header" is required');
      })
      .catch(console.error);
  }); // end it
  it('should not return user when header is set to empty', (done) => {
    request(app)
      .get('/users/auth')
      .set('x-auth', '')
      .expect(401)
      .end((err, user) => {
        if(err) {
          return done(err);
        }
        expect(user.body.error[0].message).toBe('"x-auth Header" is not allowed to be empty')
        done();
      });
  }); // end it
  it('should return 404 for a valid token that is not in the db', (done) => {
    const token = jwt.sign({access: 'auth', _id: new ObjectID()}, 'haleemah123');
    request(app)
      .get('/users/auth')
      .set('x-auth', token)
      .expect(404)
      .end((err, user) => {
        if(err) {
          return done(err);
        }
        expect(user.body.message).toBe('user not found')
        done();
      });
  }); // end it
  it('should return 401 for invalid token signature', (done) => {
    const token = jwt.sign({access: 'auth', _id: new ObjectID()}, 'haleemah123').toString().slice(0, -4) + '1234';
    request(app)
      .get('/users/auth')
      .set('x-auth', token)
      .expect(401)
      .end((err, user) => {
        if(err) {
          return done(err);
        }
        expect(user.body.message).toBe('invalid signature')
        done();
      });
  }); // end it
  it('should return 401 for a invalid token', (done) => {
    const token = jwt.sign({access: 'auth', _id: new ObjectID()}, 'haleemah123').toString().slice(1);
    request(app)
      .get('/users/auth')
      .set('x-auth', token)
      .expect(401)
      .end((err, user) => {
        if(err) {
          return done(err);
        }
        expect(user.body.message).toBe('invalid token');
        done();
      });
  }); // end it
  it('should return 401 for a invalid token 344yyhh of shorter length', async () => {
    const token = '344yyhh';
    request(app)
      .get('/users/auth')
      .set('x-auth', token)
      .expect(401)
      .end((err, user) => {
        if(err) {
          return console.error(err);
        }
        expect(user.body.message).toBe('jwt malformed')
      });
  }); // end it
  it('should return authenticated user', (done) => {
    const [{ tokens: [{token}]}] = userPayload;
    request(app)
      .get('/users/auth')
      .set('x-auth', token)
      .expect(200)
      .end((err, user) => {
        if(err) {
          return done(err);
        }
         expect(user.body.email).toBe('abc@gmail.com');
         done();
      });
  }); // end it

}); // end GET /users/auth

describe('POST /users/login', () => {
  it('should login an authenticated user', (done) => {
    let result;
    const [, {email}] = userPayload;
    request(app)
      .post('/users/login')
      .send({
        email, 
        password: plainPassword2,
      })
      .expect(200)
      .then( res => {
        result = res;
        expect(res.body.message).toBe('login was successful');
        expect(res.header['x-auth']).toBeTruthy();
        return User.findById(res.body.user._id)
        .catch(err => { throw err });
      })
      .then(foundUser => {
          const { tokens: [{token}]} = foundUser;
          expect(result.header['x-auth']).toBe(token);
          done();
        })
      .catch(done);
  }); // end it
  it('should return 401 for email that is not in the db',  (done) => {
    const [, {email}] = userPayload;
    request(app)
      .post('/users/login')
      .send({
        email: 'xxx@gamil.com',
        password: plainPassword,
      })
      .expect(401)
      .end((err, user) => {
        if(err) return done(err);
        
        expect(user.body.error).toBe('incorrect email or password');
        expect(user.header['x-auth']).toBeFalsy();
        done();
      });
  }); // end it
  it('should return 401 for invalid password', async () => {
    const [{email}] = userPayload;
    request(app)
      .post('/users/login')
      .send({
        email, 
        password: plainPassword2,
      })
      .expect(401)
      .end((err, user) => {
        if(err) return console.error(err);
        expect(user.body.error).toBe('incorrect email or password');
      });
  }); // end it
  it('should return 400 for empty payload', async () => {
    const [{email}] = userPayload;
    request(app)
      .post('/users/login')
      .expect(400)
      .end((err, user) => {
        if(err) return console.error(err);
        expect(user.body.message).toBe('Invalid input');
        expect(user.body.error.length).toBe(2);
        expect(user.body.error[0]).toEqual(expect.objectContaining({
          message: expect.stringMatching(/is required/),
        }))
      });
  }); // end it
  
}); // end POST /users/login

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