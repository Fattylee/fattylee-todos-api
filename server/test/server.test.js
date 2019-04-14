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
    it('should GET /', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        done();
      });
  }); // end it
}); //end Home page

describe('GET /todos', () => {
  it('should get all todos created by a user GET /todos', (done) => {
    const [{tokens: [{token}]}] = userPayload;
    request(app)
      .get('/todos')
      .set('x-auth', token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  }); // end it
    it('should not return for a todo not created by a user', (done) => {
    const [{tokens: [{token}]}] = userPayload;
    request(app)
      .get('/todos')
      .set('x-auth', token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
        expect(res.body.todos[0].text).not.toBe(todoPayload[1].text);
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  }); // end it
}); //End GET /todos

describe('GET /todos/admin', () => {
  it('should get all todos created by all users', (done) => {
    const [{tokens: [{token}]}] = userPayload;
    request(app)
      .get('/todos/admin')
      .set('x-auth', token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(3);
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  }); // end it
  it('should return unauthorized for non admin user', (done) => {
    const [, , {tokens: [{token}]}] = userPayload;
    request(app)
      .get('/todos/admin')
      .set('x-auth', token)
      .expect(401)
      .expect(res => {
        expect(res.body.error.message).toBe('no admin priviledge');
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  }); // end it
}); //End GET /todos/admin

describe('GET /todos/:id', () => {
  const [{tokens: [{token}]}] = userPayload;
  it('should get a todo by id: GET /todos/id', (done) => {
      const id = todoPayload[0]._id.toHexString();
      request(app)
        .get(`/todos/${id}`)
        .set('x-auth', token)
        .expect(200)
        .then(todo => {
          expect(todo.body.todo.text).toBe(todoPayload[0].text);
          done();
          })
          .catch(err => done(err));
  }); // end it
  
  it('should return 404 for todo not in the db: GET /todos/validID', done => {
    const validID = new ObjectID().toString();
    request(app)
      .get('/todos/' + validID)
      .set('x-auth', token)
      .expect(404)
      .expect(res => {
        expect(res.body.error.message).toBe('todo item not found');
      })
      .end(done);
  }); // end it
  it('should return 404 for a valid todo not created by the user', done => {
    const [, { _id } ] = todoPayload;
    request(app)
      .get('/todos/' + _id)
      .set('x-auth', token)
      .expect(404)
      .end((err, res) => {
        if(err) return done(err);
          expect(res.body.error.message).toBe('todo item not found');
        done();
      });
  }); //end it
}); // end GET /todos/:id

describe('POST /todos', () => {
  const [{tokens: [{token}]}] = userPayload;
  it('should create a todo: POST /todos', (done) => {
    request(app)
      .post('/todos')
      .send({text: todoPayload[0].text})
      .set('x-auth', token)
      .expect(201)
      .expect(async (res) => {
         expect(res.body.todo.text).toBe(todoPayload[0].text);
         expect(res.body.todo._owner).toEqual(todoPayload[0]._owner.toString());
       const todos = await Todo.find().catch(done);
       expect(todos.length).toBe(4)
      })
      .end(done)
    }); // end it
      
  it('should not create a new todo when payload is empty', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .set('x-auth', token)
      .expect(400)
      .end((err, res) => {
        if(err) return done(err);
          Todo.countDocuments().then(count => {
            expect(count).toBe(3);
            done();
          }).catch(done);
      });
  }); // end it
}); // end POST /todos

describe('DELETE /todos/id', () => {
    const [{tokens: [{token}]}] = userPayload;
    it('should delete a todo: DELETE /todos/id', (done) => {
      const { _id } = todoPayload[0];
      request(app)
        .delete('/todos/' + _id)
        .set('x-auth', token)
        .expect(200)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body._id).toBe(_id.toString());
          done();
        });
    }); // end it
    it('should not delete a todo for a todo not in the db: DELETE /todos/id', (done) => {
      const _id = new ObjectID();
      request(app)
        .delete('/todos/' + _id)
        .set('x-auth', token)
        .expect(404)
        .end((err, res) => {
          if(err) return done(err);
          
          expect(res.body.error.message).toBe('Todo not found');
          done();
        });
    }); // End it
});// End DELETE todos/:id

describe('DELETE /todos', () => {
  
  const [{tokens: [{token}]}] = userPayload;
  it('should delete all todos', (done) => {
    request(app)
      .delete('/todos/')
      .set('x-auth', token)
      .expect(200)
      .end(async (err, res) => {
        if(err) return done(err);
        expect(res.body.message).toBe('all todos deleted');
        const todos = await Todo.find().catch(done);
        expect(todos.length).toBe(1);
          done();
        });
    }); // end it
}); // end DELETE /todos

describe('PATCH /todos/id', () => {
  const [{tokens: [{token}]}] = userPayload;
  it('should update a todo succesdully: PATCH /todos/id', (done) => {
    request(app)
      .patch('/todos/' + todoPayload[0]._id)
      .set('x-auth', token)
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
    it('should return 404 for todoId that is not in the db: PATCH /todos/id', (done) => {
      request(app)
        .patch('/todos/' + new ObjectID().toHexString())
        .set('x-auth', token)
        .expect(404)
        .expect( res => {
          expect(res.body.error.message).toMatch(/not found/);
        })
        .end(done);
    }); // end it
    
    it('should clear completedAt when todo is not completed', (done) => {
      request(app)
        .patch('/todos/' + todoPayload[0]._id)
        .set('x-auth', token)
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
        .set('x-auth', token)
        .send({ completed: true })
        .expect(200)
        .expect( res => {
          expect(res.body.todo.completedAt).toBeGreaterThan(0);
        })
        .end(done);
    }); // end it
    it('should not update a todo that is not created by a user', (done) => {
      const [, , {tokens: [{token}]}] = userPayload;
      request(app)
        .patch('/todos/' + todoPayload[0]._id)
        .set('x-auth', token)
        .send({ completed: true })
        .expect(404)
        .expect( res => {
          expect(res.body.error.message).toMatch(/not found/);
        })
        .end(done);
    }); // end it
}); // End PATCH todos/:id

describe('GET /users', () => {
    
    it('should return 401 for non admin user', (done) => {
       const [, , {tokens: [{token}]}] = userPayload;
       request(app)
        .get('/users')
        .expect(401)
        .set('x-auth', token)
        .expect((res) => {
          expect(res.body.error.message).toBe('no admin priviledge');
        })
        .end(done);
    }); // end it
    it('should get all users for an admin user', (done) => {
       const [{tokens: [{token}]}] = userPayload;
       request(app)
        .get('/users')
        .expect(200)
        .set('x-auth', token)
        .expect((res) => {
          expect(res.body.users.length).toBe(3);
        })
        .end(done);
    }); // end it
    
}); // end GET /users

describe('DELETE /users', () => {
  const [{tokens: [{token}]}] = userPayload;
  it('should delete all users without admin priviledge in the db', (done) => {
    request(app)
      .delete('/users')
      .send({ key: process.env.SUPER_USER_KEY })
      .set('x-auth', token)
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        User.find()
        .then( users => {
          expect(users.length).toBe(1);
          return Todo.find();
        })
        .then( todos => {
          expect(todos.length).toBe(2);
          expect(res.body.message).toBe('all non-admin users deleted');
          done();
        })
        .catch(done);
        });
    }); // end it
    it('should not delete users in the db if key is not supplied', (done) => {
    request(app)
      .delete('/users')
      .set('x-auth', token)
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
      .set('x-auth', token)
      .send({ key: 'vvgvv' })
      .expect(401)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.error.message).toBe('Invalid key');
          done();
        });
    }); // end it
    it('should not delete users in the db if user is not an admin', (done) => {
      const [, , {tokens: [{token}]}] = userPayload;
    request(app)
      .delete('/users')
      .set('x-auth', token)
      .send({ key: process.env.SUPER_USER_KEY })
      .expect(401)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.error.message).toBe('no admin priviledge');
          done();
        });
    }); // end it
    
}); // end DELETE /users

describe('DELETE /users/id', () => {
  const [{tokens: [{token}]}, {_id}] = userPayload;
  it('should delete a user in the db', (done) => {
    request(app)
      .delete('/users/' + _id)
      .send({ key: process.env.SUPER_USER_KEY })
      .set('x-auth', token)
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        User.find().then( users => {
          expect(users.length).toBe(2);
          Todo.find().then( todos => {
          expect(todos.length).toBe(2);
          expect(res.body.message).toBe('user deleted');
          done();
        }).catch(done);
        }).catch(done);
        });
    }); // end it
    it('should return 404 for user not in the db', (done) => {
    request(app)
      .delete('/users/' + new ObjectID())
      .send({ key: process.env.SUPER_USER_KEY })
      .set('x-auth', token)
      .expect(404)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.error.message).toEqual('user not found');
          done();
        });
    }); // end it
}); // end DELETE /users/id

describe('PATCH /users/admin/id', () => {
  const [{tokens: [{token}]}, { _id }] = userPayload;
  it('should upgrade a user priviledge to admin', (done) => {
    request(app)
      .patch('/users/admin/' + _id)
      .set('x-auth', token)
      .expect(200)
      .expect(async res => {
        const users = await User.find().catch(done);
        expect(users[1].isAdmin).toBeTruthy();
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.message).toBe('user upgraded to admin');
          done();
        });
    }); // end it
    it('should return 404 for user not in the db', (done) => {
    request(app)
      .patch('/users/admin/' + new ObjectID())
      .set('x-auth', token)
      .expect(404)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.error.message).toBe('user not found');
          done();
        });
    }); // end it
    it('should return 403 for a user that is already an admin', (done) => {
      const [{ _id }] = userPayload;
    request(app)
      .patch('/users/admin/' + _id)
      .set('x-auth', token)
      .expect(403)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.error.message).toBe('already an admin');
          done();
        });
    }); // end it
}); // end PATCH /users/admin/id 

describe('DELETE /users/admin/id', () => {
  const [{tokens: [{token}]}] = userPayload;
  it('should remove admin priviledge from a user', (done) => {
    const [{ _id }] = userPayload;
    request(app)
      .delete('/users/admin/' + _id)
      .set('x-auth', token)
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        
        expect(res.body.message).toBe('admin priviledge removed successfully');
        User.find()
          .then( users => {
            expect(users[0].isAdmin).toBeFalsy();
            done();
          })
          .catch(done);
        });
    }); // end it
    
    it('should return 404 for user not in the db', (done) => {
    request(app)
      .delete('/users/admin/' + new ObjectID())
      .set('x-auth', token)
      .expect(404)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.error.message).toBe('user not found');
          done();
        });
    }); // end it
    it('should return 403 for a user that is not an admin', (done) => {
      const [, { _id }] = userPayload;
    request(app)
      .delete('/users/admin/' + _id)
      .set('x-auth', token)
      .expect(403)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.error.message).toBe('already a user without admin priviledge');
          done();
        });
    }); // end it 
}); // end PATCH /users/admin/id 

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
         expect(data.length).toBe(4);
       expect(data[2].password).not.toBe(payload.password);
       done();
       }).catch( err => done(err));
      }).
      catch(done);
  }); // End it
  it('should not create a new user when payload is empty', (done) => {
    request(app)
      .post('/users')
      .send()
      .expect(400)
      .end(async (err, res) => {
        if(err) return done(err);
        
        expect(res.body.message).toBe('Invalid input');
        expect(res.body.error.length).toBe(2);
        const users = await User.find().catch(done);
        expect(users.length).toBe(3);
        done();
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
        expect(count).toBe(3);
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
        expect(users.length).toBe(3);     
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
    const token = jwt.sign({access: 'auth', _id: new ObjectID()}, process.env.JWT_SECRETE);
    request(app)
      .get('/users/auth')
      .set('x-auth', token)
      .expect(404)
      .end((err, user) => {
        if(err) {
          return done(err);
        }
        expect(user.body.error.message).toBe('token not found')
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
        expect(user.body.error.message).toBe('invalid signature')
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
        expect(user.body.error.message).toBe('invalid token');
        done();
      });
  }); // end it
  it('should return 401 for a invalid token 344yyhh of shorter length', (done) => {
    const token = '344yyhh';
    request(app)
      .get('/users/auth')
      .set('x-auth', token)
      .expect(401)
      .end((err, user) => {
        if(err) {
          return done(err);
        }
        expect(user.body.error.message).toBe('jwt malformed');
        done();
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
    const [, {email}] = userPayload;
    request(app)
      .post('/users/login')
      .send({
        email, 
        password: plainPassword2,
      })
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        
        expect(res.body.message).toBe('login was successful');
        expect(res.header['x-auth']).toBeTruthy();
        User.findById(res.body.user._id)
        .then(foundUser => {
          const { tokens: [{token}]} = foundUser;
          expect(res.header['x-auth']).toBe(token);
          done();
        })
        .catch(done);
      });
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

describe('Test authenticated middleware', () => {
  it('should return authenticated user', (done) => {
    const [{tokens: [{token}]}] = userPayload;
    request(app)
      .get('/users/auth')
      .set('x-auth', token)
      .expect(200)
      .expect(res => {
        expect(res.body.email).toBe('abc@gmail.com');
      })
      .end(done)
  }); // end it
  it('should return unauthorized for invalid token', (done) => {
    let [{tokens: [{token}]}] = userPayload;
    token = token.slice(0, -4) + '1234';
    request(app)
      .get('/todos')
      .set('x-auth', token)
      .expect(401)
      .expect(res => {
        expect(res.body.error.message).toBe('invalid signature');
      })
      .end(done);
  }); // end it
  it('should return 401 for empty token', (done) => {
    request(app)
      .get('/todos')
      .expect(401)
      .expect(res => {
        expect(res.body.error[0].message).toBe('"x-auth Header" is required');
      })
      .end(done);
  }); // end it
}); // end /users/auth

describe('Test validateTodoIdParams middleware', () => {
  const [{tokens: [{token}]}] = userPayload;
  it('should return 400 for invalid id: GET /todos/123', done => {
    request(app)
      .get('/todos/123')
      .set('x-auth', token)
      .expect(400)
      .end((err, res) => {
        if(err) return done(err);
          expect(res.body.message).toBe('Invalid id');
        done();
      });
  }); //end it
}); // end validateTodoIdParams middleware

describe('Test validateKey middleware', () => {
  const [{tokens: [{token}]}] = userPayload;
  it('should return 400 for empty payload', done => {
    request(app)
      .delete('/users/')
      .set('x-auth', token)
      .expect(400)
      .end((err, res) => {
        if(err) return done(err);
          expect(res.body.message).toBe('Invalid input');
          expect(res.body.error[0].message).toBe('"key" is required')
        done();
      });
  }); //end it
  it('should return 400 for invalid key type', done => {
    request(app)
      .delete('/users/')
      .set('x-auth', token)
      .send({key: 45})
      .expect(400)
      .end((err, res) => {
        if(err) return done(err);
          expect(res.body.message).toBe('Invalid input');
          expect(res.body.error[0].message).toBe('"key" must be a string')
        done();
      });
  }); //end it
    it('should return 401 for invalid key', done => {
    request(app)
      .delete('/users/')
      .set('x-auth', token)
      .send({key: 'ywywyw'})
      .expect(401)
      .end((err, res) => {
        if(err) return done(err);
          expect(res.body.error.message).toBe('Invalid key');
        done();
      });
  }); //end it
}); // end validateKey middleware

//logout route
describe('DELETE /users/auth/token', () => {
  it('should logout a login user', (done) => {
    const [{tokens: [{token}]}] = userPayload;
    request(app)
      .delete('/users/auth/token')
      .expect(200)
      .set('x-auth', token)
      .end((err, res) => {
        if(err) return done(err);
        
        expect(res.body.message).toBe('logout was successful');
        done();
      });
  }); // end it
}); // End DELETE /users/auth/token

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