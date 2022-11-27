const eventNumber = new Proxy([], {
  get: (target, index) => {
    console.log('get -> target : ', target);
    console.log('get -> index : ', index);
    return index * 2;
  },
  has: (target, number) => {
    console.log('has -> target : ', target);
    console.log('has -> number : ', number);
    return number % 2 === 0;
  },
});

console.log(2 in eventNumber);
console.log(5 in eventNumber);
console.log(eventNumber[7]);
