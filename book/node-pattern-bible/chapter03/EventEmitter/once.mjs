import { EventEmitter } from 'events';
const emitter = new EventEmitter();

emitter.on('a', data => console.log(`a : ${data}`));
//한번 받으면 자동으로 리스너를 해지
emitter.once('b', data => console.log(`b : ${data}`));
emitter.on('c', data => console.log(`c : ${data}`));

emitter.emit('a', 'aaaa');
emitter.emit('a', 'aaaa');
emitter.emit('b', 'aaaa');
emitter.emit('b', 'aaaa');
emitter.emit('c', 'aaaa');
emitter.emit('c', 'aaaa');
