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

asyncMethod();
   