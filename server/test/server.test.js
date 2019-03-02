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
        //  console.log(JSON.stringify(res.body, null, 2));
        Todo.find({
       //   _id: '5c7a5215acfff5567ecd9ad5',
       completed: true,
        })
        // .select('text -_id')
       // .select({text: true, _id: false})
        //.sort('-text')
        //.sort({text: -1})
        //.limit(3)
       /* .exec((err, res) =>{
          const size = res.length;
            console.log(res, 'Count 2:', size);
            done();
        })*/
          .then(res => {
            const size = res.length;
            console.log(res, 'Count:', size);
            /*
            Todo.updateOne(
            {
          _id: '5c7a5215acfff5567ecd9ad5'
            },
            {
              text: 'something else two',
            })
            .then(res => {
              console.log('update:', res)
              
            }).catch(console.log)
            // expect(res.length).toBe(size -1);
            
            const newTask = new Todo({
              text: 'Khadijah bint AbdilHakeem',
              completed: true
            });
            newTask.save().then(doc => {
              console.log(doc);
              done();
            })
            .catch(console.log);
            */
            done();
          })
          /*.then((err, res) =>{
          const size = res.length;
            console.log(res, 'Count 2:', size);
            done();
        })*/
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
  
  
})
