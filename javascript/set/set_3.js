const arr = [
  { user_name: 'minwoo', user_age: 30},
  { user_name: 'minwoo', user_age: 30},
  { user_name: 'minwoo1', user_age: 30},
  { user_name: 'minwoo1', user_age: 31},
]
var mySet = new Set(arr);

// mySet.add(1); // Set { 1 }
// mySet.add(5); // Set { 1, 5 }
// mySet.add(5); // Set { 1, 5 }
// mySet.add('some text'); // Set { 1, 5, 'some text' }
// var o = {a: 1, b: 2};
// mySet.add(o);

// mySet.add({a: 1, b: 2}); // o와 다른 객체를 참조하므로 괜찮음

// mySet.has(1); // true
// mySet.has(3); // false, 3은 set에 추가되지 않았음
// mySet.has(5);              // true
// mySet.has(Math.sqrt(25));  // true
// mySet.has('Some Text'.toLowerCase()); // true
// mySet.has(o); // true

// mySet.size; // 5

// mySet.delete(5); // set에서 5를 제거함
// mySet.has(5);    // false, 5가 제거되었음

mySet.size; // 4, 방금 값을 하나 제거했음
console.log(mySet);// Set {1, "some text", Object {a: 1, b: 2}, Object {a: 1, b: 2}}
