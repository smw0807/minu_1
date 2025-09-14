const obj = {
  name: 'John',
  age: 20,
  city: 'Seoul',
};

for (const key in obj) {
  console.log(key, obj[key]);
}

console.log('--------------------------------');

const arr = ['a', 'b', 'c', 'd', 'e'];
for (const item of arr) {
  console.log(item);
}

console.log('--------------------------------');
