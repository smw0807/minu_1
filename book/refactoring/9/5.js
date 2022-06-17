/**
 * 값을 참조로 바꾸기
 * 1. 같은 부류에 속하는 객체들을 보관할 저장소를 만든다.(이미 있다면 생략)
 * 2. 생성자에서 이 부류의 객체들 중 특정 객체를 정확히 찾아내는 방법이 있는지 확인한다.
 * 3. 호스트 객체의 생성자들을 수정하여 필요한 객체를 이 저장소에서 찾도록 한다.
 *    하나 수정할 때마다 테스트한다.
 */

class Customer {
  constructor(id) {
    this._id = id;
  }
  get id () { return this._id; }
}
class Order {
  constructor(data) {
    this._number = data.number;
    // this._customer = new Customer(data.customer);
    this._customer = registerCustomer(data.customer);
  }
  get customer() { return this._customer; }
}

let _repositoryData;

function initialize() {
  console.log('------initialize start -----');
  _repositoryData = {};
  _repositoryData.customers = new Map();
  console.log('------initialize end -----');
}

function registerCustomer(id) {
  if (! _repositoryData.customers.has(id)) {
    _repositoryData.customers.set(id, new Customer(id));
  }
  return findCustomer(id);
}

function findCustomer(id) {
  return _repositoryData.customers.get(id);
}

initialize();
const order1 = new Order({customer: 100, number: 5});
console.log(order1.customer);
const order2 = new Order({customer: 100, number: 2});
const order3 = new Order({customer: 100, number: 3});
const order4 = new Order({customer: 200, number: 1});
const order5 = new Order({customer: 300, number: 1});

console.log(_repositoryData);