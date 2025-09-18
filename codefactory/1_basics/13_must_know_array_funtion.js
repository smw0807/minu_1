/**
 * Array Functions
 */
let iveMembers = ['안유진', '가을', '레이', '장원영', '리즈', '이서'];
console.log(iveMembers);

iveMembers.push('카즈하');
console.log(iveMembers);
console.log('--------------------------------');

console.log('pop', iveMembers.pop());
console.log(iveMembers);
console.log('--------------------------------');
console.log('shift', iveMembers.shift());
console.log(iveMembers);
console.log('--------------------------------');
console.log('unshift', iveMembers.unshift('카즈하'));
console.log(iveMembers);

console.log('--------------------------------');
console.log('splice', iveMembers.splice(1, 2));
console.log(iveMembers);
console.log('--------------------------------');
console.log('slice', iveMembers.slice(1, 3));
console.log(iveMembers);
console.log('--------------------------------');

iveMembers = ['안유진', '가을', '레이', '장원영', '리즈', '이서'];
console.log('--------------------------------');
console.log(iveMembers);

//새로운 어레이를 만들어서 반환
console.log('concat', iveMembers.concat(['카즈하', '미야']));
console.log(iveMembers);

//새로운 어레이를 만들어서 반환
console.log('--------------------------------');
console.log('slice', iveMembers.slice(0, 3));
console.log(iveMembers);

// spread operator
let iveMembers2 = [...iveMembers];
console.log(iveMembers2);

console.log('--------------------------------');
// ㅓoin
console.log('join', iveMembers.join());
console.log('join2', iveMembers.join('/'));
console.log('join3', iveMembers.join(', '));

console.log('--------------------------------');

// sort
// 오름차순 (ASC)
console.log('sort', iveMembers.sort());
// 내림차순 (DESC)
console.log('sort2', iveMembers.reverse());

console.log('--------------------------------');
let numbers = [1, 9, 7, 5, 3];
console.log(numbers);
//a, b 비교했을 때
// 1) a를 b 보다 나중에 정렬하려면 (뒤에두려면) 0보다 큰 숫자를 반환
// 2) a를 b 보다 일찍 정렬하려면 (앞에두려면) 0보다 작은 숫자를 반환
// 3) a와 b를 같은 순서로 정렬하려면 0을 반환
numbers.sort((a, b) => {
  return a > b ? 1 : -1;
});
console.log(numbers);

const persons = [
  { name: 'a', age: 20 },
  { name: 'b', age: 22 },
  { name: 'c', age: 25 },
  { name: 'd', age: 23 },
];
persons.sort((a, b) => {
  return a.age > b.age ? -1 : 1;
});
console.log(persons);

console.log('--------------------------------');

// map
console.log(
  'map',
  iveMembers.map(v => v)
);

console.log('--------------------------------');

// reduce
console.log(numbers.reduce((p, n) => p + n, 0));
