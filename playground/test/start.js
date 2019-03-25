/*
beforeEach(() => {
 console.log('beforeEach it');
});
describe('🚫first describe', () => {
  before(() => {
  console.log('before second describe');
});
  describe('🚫second describe', () => {
    describe('😍😍😍😎😎😎😁🤣😘context😔😄🐷🦄🐃🦌🐃🐃🦌', () => {
    it('it - after second describe', () => {});
    describe('🚫third describe', () => {
      beforeEach(() => {
 console.log('😋beforeEach it');
});
      before(() => {
  console.log('before fourth describe');
});
      describe('🚫fourth describe', () => {
         beforeEach(() => {
 console.log('😋😍beforeEach it');
});
        it('it - 1', () => {});
         beforeEach(() => {
 console.log('😋🤣😭beforeEach it');
});
        before(() => {
          
  console.log('before it - 2 describe');
});
        it('it - 2', () => {});
        it('it - 3', () => {});
              before(() => {
  console.log('before after it - 3 describe');
}); beforeEach(() => {
 console.log('😋👌😎😜🙄😂😋beforeEach it');
});
      });
    });
    });
  });
}); 
*/


after('fattylee after', () => {
  console.log('after all describe');
});


afterEach('fattylee afterEach it', () => {
  console.log('afterEach it');
});
beforeEach('fattylee beforeEach', () => {
  console.log('beforeEach it');
});


before('fattylee before', () => {
  console.log('before all describe');
});


describe('describe 1', () => {
  it(' it abdul inside', function(){ /*this.skip()*/
  //expect('2').toBeString();
  });
  describe('describe 2 db', () => {
    it(' it inside describe 2 fat', () =>{});
  })
})