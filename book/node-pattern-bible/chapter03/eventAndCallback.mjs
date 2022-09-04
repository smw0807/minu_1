import { EventEmitter } from 'events';

function helloEvent() {
  const eventEmitter = new EventEmitter();
  setTimeout(() => eventEmitter.emit('complete', 'hello world'), 100);
  return eventEmitter;
}
function helloCallback(cb) {
  setTimeout(() => cb(null, 'hello world'), 100);
}

helloEvent().on('complete', message =>
  console.log('helloEvent message : ', message)
);
helloCallback((err, message) => console.log('callback message : ', message));
