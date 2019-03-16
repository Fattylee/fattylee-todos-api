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
 promise1()
   .then( data => {
     console.log('Promise 1 data:', data);
     
     //pass = false;
     data1 = data;
     return promise2(data)
   })
    .then( data2 => {
      try { throw new Error('HI HERE');} catch(err) {console.log(err)}
         console.log('Promise 2 data resolved',data1, data2);
   })
   .catch( err => console.log('ERROR:', err));
   
   
   