/*
주어진 크기의 버퍼에 대한 가상 프록시를 생성하는 팩토리 함수인 createLazyBuffer(size)를 구현.
프록시 인스턴스는 write()가 처음 호출될 때만 Buffer 객체(주어진 메모리 크기를 효과적으로 할당)를 인스턴스화해야 한다.
버퍼에 쓰기를 시도하지 않으면 buffer 인스턴스는 생성되지 않아야한다.
*/

const createLazyBuffer = size => {
  let bufferInstance;

  const handler = {
    get(target, props) {
      if (props == 'write' && !bufferInstance) {
        bufferInstance = Buffer.alloc(size);
      }

      if (bufferInstance && typeof bufferInstance[props] === 'function') {
        return function (...args) {
          return bufferInstance[props](...args);
        };
      }
      return bufferInstance ? bufferInstance[props] : undefined;
    },
  };
  return new Proxy({}, handler);
};

const buffer = createLazyBuffer(10);

console.log(buffer.length); //아무것도 출력안됨
console.log('-----------');

//실제로 Buffer 인스턴스가 생성되고 여기에 "Hello"를 씁니다.
buffer.write('Hello Buffer?', 'utf-8');
//"Hello"를 출력합니다.
console.log(buffer.toString());
