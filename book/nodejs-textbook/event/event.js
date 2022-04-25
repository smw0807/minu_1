const EventEmitter = require('events');

const myEvent = new EventEmitter();
myEvent.addListener('event1', (a) => {
  console.log('event1!!', a);
})
myEvent.on('event2', () => {
  console.log('event2');
})
myEvent.on('event2', () => {
  console.log('add event2');
})
myEvent.once('event3', () => {
  console.log('event3');
}) //한 번만 실행됨

myEvent.emit('event1', 'aa');
myEvent.emit('event1');
myEvent.emit('event2'); //add event2까지 2개가 실행됨
myEvent.emit('event2'); //add event2까지 2개가 실행됨
myEvent.emit('event3');
myEvent.emit('event3'); //once라 위에 한번 실행 후 실행안됨

myEvent.on('event4', () => {
  console.log('event4');
})
myEvent.removeAllListeners('event4');
myEvent.emit('event4'); //실행안됨

const listener = () => {
  console.log('event5??');
}
myEvent.on('event5', listener);
myEvent.emit('event5');
myEvent.removeListener('event5', listener);
myEvent.emit('event5'); //실행 안됨

console.log(myEvent.listenerCount('event2'));  //event2 개수
module.exports = myEvent;