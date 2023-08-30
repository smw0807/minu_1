const A_CHAR_CODE = 65;
const Z_CHAR_CODE = 90;
/**
String.fromCodePoint() 메소드
이 메소드는 쉼표로 구분되는 일련의 코드 포인트(code point)에 해당하는 문자들로 구성된 문자열을 반환합니다.
 */
function createAlphabetIterator() {
  let currCode = A_CHAR_CODE;

  return {
    next() {
      const currChar = String.fromCodePoint(currCode);
      if (currChar > Z_CHAR_CODE) {
        return { done: true };
      }
      currCode++;
      return { value: currChar, done: false };
    },
  };
}

const iterator = createAlphabetIterator();

let iteratorResult = iterator.next();
while (!iterator.done) {
  console.log(iterator.value);
  iteratorResult = iterator.next();
}
