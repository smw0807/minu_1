//캡슐화 관련
const assert = require('assert');

let defaultOwnerData = {
  firstName: '마틴',
  lastName: '파울러'
}
function defaultOwner() {
  /**
   * 원본데이터의 복제본을 리턴시키기
   * 데이터의 복제본을 반환하면 클라이언트는 게터로 얻은 데이터를 변경할 수 있지만, 원본에는 아무 영향을 주지 못한다.
   * 물론 이 방법이 무조건 정답은 아니다. 상황에 따라 복제본을 넘겨도 상관없을 수도 있고, 아닐 수도 있으니 잘 생각해서 결정할 것.
   */
  return Object.assign({}, defaultOwnerData); //이건 검증 실패함
  // return defaultOwnerData; //이건 검증 통과함 
}
function setDefaultowner(arg) {
  defaultOwnerData = arg;
}

console.log('원본 데이터 : ', defaultOwner());
const owner1 = defaultOwner();
console.log('owner1 : ', owner1);
assert.equal("파울러", owner1.lastName, "처음 값 확인");

const owner2 = defaultOwner();
console.log('owner2 변경 전 : ', owner2);
owner2.lastName = '파슨스'; //복제본을 리턴하지 않으면 이렇게 할 때 owner1의 lastName도 변경됨
console.log('owner1 : ', owner1);
console.log('owner2 변경 후 : ', owner2);
assert.equal("파슨스", owner1.lastName, "owner2를 변경한 후");

/**
 * 복제본 리턴했을 때 결과 값
원본 데이터 :  { firstName: '마틴', lastName: '파울러' }
owner1 :  { firstName: '마틴', lastName: '파울러' }
owner2 변경 전 :  { firstName: '마틴', lastName: '파울러' }
owner1 :  { firstName: '마틴', lastName: '파슨스' }
owner2 변경 후 :  { firstName: '마틴', lastName: '파슨스' }
*/
/**
 * 원본 데이터로 리턴했을 때 결과 값
원본 데이터 :  { firstName: '마틴', lastName: '파울러' }
owner1 :  { firstName: '마틴', lastName: '파울러' }
owner2 변경 전 :  { firstName: '마틴', lastName: '파울러' }
owner1 :  { firstName: '마틴', lastName: '파울러' }
owner2 변경 후 :  { firstName: '마틴', lastName: '파슨스' }
 */