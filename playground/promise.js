 const pass = true;
 
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
 
 promise1()
   .then( data => {
     console.log('Promise 1 data:', data);
     
     promise2(data)
       .then( data2 => {
         console.log('Promise 2 data resolved', data, data2);
       })
       .catch( err => console.log('ERROR 2:', err));
   })
   .catch( err => console.log('ERROR 1:', err));
   
   
   