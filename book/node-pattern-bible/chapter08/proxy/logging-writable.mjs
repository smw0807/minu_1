/**
 * write() 함수에 대한 모든 호출을 가로채고, 이러한 상황이 발생할 때마다,
 * 메세지를 기록하는 Writable 스트림에 대해 프록시 역할을 하는 객체
 */

import { createWriteStream } from 'fs';

function createLoggingWritable(writable) {
  //1. Proxy 생성자를 사용하여 원래 writable 객체에 대한 프록시를 만들고 반환한다.
  return new Proxy(writable, {
    //2. get 트랩을 사용하여 객체의 속성에 대한 접근을 가로챈다.
    get(target, propKey, receiver) {
      // console.group('=== get ===');
      // console.log('target : ', target);
      // console.log('propKey : ', propKey);
      // console.log('receiver : ', receiver);
      // console.groupEnd();
      //3. 접근한 속성이 writable 함수인지 확인한다.
      if (propKey === 'write') {
        //4. 원래 함수에 전달된 인자 목록에서 현재 청크를 추출하고 청크의 내용을 기록한 다음, 마지막으로 주어진 인자 목록에서 원래의 함수를 호출한다.
        return function (...args) {
          console.log(args);
          const [chunk] = args;
          console.log('Writing : ', chunk);
          return writable.write(...args);
        };
      }
      //5. 다른 모든 속성에 대해서는 변경 없이 반환한다.
      return target[propKey];
    },
  });
}

const writable = createWriteStream('test.txt');
const writableProxy = createLoggingWritable(writable);

writableProxy.write('First chunk');
writableProxy.write('Second chunk');
writable.write('This is not logged');
writableProxy.end();

/**
 * console.log 결과
[ 'First chunk' ]
Writing :  First chunk
[ 'Second chunk' ]
Writing :  Second chunk
 */
