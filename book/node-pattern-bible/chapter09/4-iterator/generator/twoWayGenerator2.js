function* twoWayGenerator() {
  try {
    const what = yield null;
    yield 'Hello ' + what;
  } catch (err) {
    yield 'Hello error: ' + err.message;
  }
}
console.log('Using throw(): ');
const twoWayException = twoWayGenerator();
// console.log(twoWayException.next());
console.log(twoWayException.throw(new Error('Boom!!!')));
/*
Using throw(): 
// { value: null, done: false }
// { value: 'Hello error: Boom!!!', done: false }
Error: Boom!!!
    at Object.<anonymous> (.../twoWayGenerator2.js:12:35)
    at Module._compile (node:internal/modules/cjs/loader:1105:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1159:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12)
    at node:internal/main/run_main_module:17:47
*/

console.log('Using return():');
const twoWayReturn = twoWayGenerator();
// console.log(twoWayReturn.next());
console.log(twoWayReturn.return('returnValue!'));
/*
Using return():
{ value: null, done: false }
{ value: 'returnValue!', done: true }
*/
