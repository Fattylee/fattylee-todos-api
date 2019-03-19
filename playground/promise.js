 let pass = true;
 
 const promise1 = () => (
   new Promise((resolve, reject) => {
     if(pass) resolve({ id: 1});
     reject('Bad id');
   })
 );
 
 const promise2 = (id) => (
   new Promise((resolve, reject) => {
     if(pass) resolve({ ...id, name: 'Abu Adnaan'});
     reject('Invalid promise2');
   })
 );
 
 let data1;
 // promise call
 const asyncMethod = async () => {
   try {
     const data = await promise1();
     console.log('Promise 1 data resolved', data);
     //pass = false;
    data1 = data;
    const data2 = await promise2(data);
    //throw new Error('HI HERE');
    //try { throw new Error('HI HERE');} catch(err) {console.log(err)}
    console.log('Promise 2 data resolved',data1, data2);
  
   }
   catch( err ) { console.log('ERROR:', err)};
   
 }

//asyncMethod();
  /*
try {
  function max(){ console.log('max function')}
} catch(err) {
  console.log('Handled Exception', err);
}

console.log('More codes ...');
*/


/*
const username = 'fattylee';
const address = '2, Ishola Daniel str.';
Promise.reject('some error')
.catch(err => { 
console.log('first catch block');
console.log(err);
throw err }) // runs 
.catch(err => {
  console.log(2, 'second catch block', err); 
  throw new TypeError({ err, user: {id: 1, username} })
  }) // runs
.catch( err => {
  console.log('third catch block');
  console.log(err);
 throw (err);
 throw new Error('err message');
})
.catch( err => {
  console.log('fourth catch block');
  console.log(JSON.stringify(err, null, 2));
  console.log('message:', err.message, '\nname:', err.name, '\nstack:', err.stack, '\nfileName:', err.fileName);
  //console.log(JSON.stringify(err.message, null, 2))
});
const error =  Error('66');
*/

//console.log(error);
//for ( const p in Error())
//console.log('hi there')

/*
try { throw new Error('Whoops!'); } catch (e) { console.log(e.name + ': ' + e.message, '\n', e ); }*/

const databaseGetUser = id => id === 'not-exists' ? Promise.reject('some weird database error') : Promise.resolve({id, username: 'username'});

const databaseGetPosts = user => user.id === 'fail-to-get-posts' ? Promise.reject('some weird database error') : Promise.resolve([{title: 'A'}, {title: 'B'}]);

/*
function getUserWithPosts(id) { 
  return databaseGetUser(id) 
           .then(user => databaseGetPosts(user) 
             .then(posts => { 
                 return {user, posts} }) 
                   .catch(err => {
                     console.log('Second|inner-block catch block')
                      throw 'failed to load posts' }) 
                      // you expect this to work right? 
            ) 
            .catch(err => {
              console.log('First catch block')
            throw `user ${id} doesn't exists ` 
            })
}
*/

async function getUserWithPosts(id) { 
  const user = await databaseGetUser(id)
                 .catch(err => {
                 console.log('First catch block', err);
                 throw (`user ${id} doesn't exists `)                
                 }) 
  const posts = await databaseGetPosts(user)
                  .catch(err => {
                    console.log('Second catch block', err);
                    ////throw 'failed to load posts' 
                    
                    });
  return {user, posts}

}
           //getUserWithPosts('lubien').then(console.log) // works fine
   
//getUserWithPosts('not-exists').catch( err => { console.error(err)}); 
// 'user not-exists doesn't exists'

getUserWithPosts('fail-to-get-posts').catch(console.error) // 'user fail-to-get-posts doesn't exists'  instead of 'failed to load posts'

console.log('codes lives on')