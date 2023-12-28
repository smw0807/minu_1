const name = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const arr = [];
for (let i = 0; i < 10; i++) {
  arr.push({
    name: name[Math.floor(Math.random() * 6)],
    number: Math.floor(Math.random() * 100),
  });
}

console.log(arr);
const test = arr.map(v => ({
  count: v.number,
}));

console.log(test);
