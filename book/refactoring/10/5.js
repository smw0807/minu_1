class Customer {

}

/**
 * 함수 의도와는 다른 비교 대상이 들어오면 에러가 출력하게.
 * @param {String} arg 
 * @returns 
 */
function isUnknown(arg) {
  if (!((arg instanceof Customer) || (arg === '미확인 고객'))) 
    throw new Error(`잘못된 값과 비교: ${arg}`);
  return (arg === '미확인 고객');
}

const test = isUnknown('df');
console.log(test);