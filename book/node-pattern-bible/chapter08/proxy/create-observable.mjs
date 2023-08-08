/**
 * 프록시는 관찰 가능한 객체를 만드는데 매우 효과적인 도구로 알려져 있다.
 * createObservable 함수는
 * 대상 객체(변경 사항을 관찰할 객체)와 관찰자(변경 사항이 감지될 때마다 호출되는 함수)를 받는다.
 *
 * proxy는 속성이 설정될 때마다 실행되는 set 트랩을 구현하고 있다.
 */

function createObservable(target, observer) {
  // Proxy를 통해 관찰 가능한 인스턴스를 생성한다.
  const observable = new Proxy(target, {
    set(obj, prop, value) {
      console.group('#### createObservable ####');
      console.log('obj : ', obj);
      console.log('prop : ', prop);
      console.log('value : ', value);
      console.groupEnd();
      if (value !== obj[prop]) {
        const prev = obj[prop];
        obj[prop] = value;
        observer({ prop, prev, curr: value });
      }
      return true;
    },
  });
  return observable;
}

function calculateTotal(invoice) {
  return invoice.subtotal - invoice.discount + invoice.tax;
}

const invoice = {
  subtotal: 100,
  discount: 10,
  tax: 20,
};

let total = calculateTotal(invoice);
console.log(`Starting total: ${total}`);

const obsInvoice = createObservable(invoice, ({ prop, prev, curr }) => {
  total = calculateTotal(invoice);
  console.log(`TOTAL : ${total} (${prop} changed: ${prev} -> ${curr})`);
  console.group('#### obsInvoice ####');
  console.log('prop : ', prop);
  console.log('prev : ', prev);
  console.log('curr : ', curr);
  console.groupEnd();
});

obsInvoice.subtotal = 200;
obsInvoice.discount = 20;
obsInvoice.discount = 20;
obsInvoice.tax = 30;

console.log(`Final total: ${total}`);

/* 실행 결과
Starting total: 110
#### createObservable ####
  obj :  { subtotal: 100, discount: 10, tax: 20 }
  prop :  subtotal
  value :  200
TOTAL : 210 (subtotal changed: 100 -> 200)
#### obsInvoice ####
  prop :  subtotal
  prev :  100
  curr :  200
#### createObservable ####
  obj :  { subtotal: 200, discount: 10, tax: 20 }
  prop :  discount
  value :  20
TOTAL : 200 (discount changed: 10 -> 20)
#### obsInvoice ####
  prop :  discount
  prev :  10
  curr :  20
#### createObservable ####
  obj :  { subtotal: 200, discount: 20, tax: 20 }
  prop :  discount
  value :  20
#### createObservable ####
  obj :  { subtotal: 200, discount: 20, tax: 20 }
  prop :  tax
  value :  30
TOTAL : 210 (tax changed: 20 -> 30)
#### obsInvoice ####
  prop :  tax
  prev :  20
  curr :  30
Final total: 210
*/
