/**
 * 노출식 모듈 패턴
 */

const myModule = ( () => {
  const privateFoo = () => { }
  const privateBar = [];
  
  const exported = {
    publicFoo: () => {} ,
    publicBar: () => {}
  }

  return exported;
})();
console.log(myModule);
console.log(myModule.publicBar, myModule.publicFoo);