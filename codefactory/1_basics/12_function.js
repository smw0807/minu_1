const multiply = x => y => z => x * y * z;
console.log(multiply(1)(2)(3));

function multiply2(x) {
  return function (y) {
    return function (z) {
      return x * y * z;
    };
  };
}
console.log(multiply2(1)(2)(3));

function multiply3(...args) {
  return Object.values(args);
}

console.log(multiply3(1, 2, 3));

(function (x, y) {
  console.log(x * y);
})(1, 2);

console.log(multiply instanceof Object);
