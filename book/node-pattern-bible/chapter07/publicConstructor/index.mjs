import { ImmutableBuffer } from './immutableBuffer.mjs';

const hello = 'Hello!';
const immutable = new ImmutableBuffer(hello.length, ({ write }) => {
  write(hello);
});

console.log(String.fromCharCode(immutable.readInt8(0))); //2

/**
 * "TypeError: immutable.write is not a function"
 * 에러 발생
 */

// immutable.write('Hello?'); //3
