const me = require('./event');
// console.log(me);
/*
ventEmitter {
  _events: [Object: null prototype] {
    event1: [Function (anonymous)],
    event2: [ [Function (anonymous)], [Function (anonymous)] ]
  },
  _eventsCount: 2,
  _maxListeners: undefined,
  [Symbol(kCapture)]: false
}
*/
// me.on('event1', () => {
//   console.log('kk');
// })

console.log('-------');
me.emit('event1');