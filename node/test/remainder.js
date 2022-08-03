function setLevel(v) {
  let refValue = 10;
  if (v > 10) {
    refValue = 20;
  }
  return v % refValue + 3;
}


const test = {
  a: setLevel(1),
  b: setLevel(2),
  c: setLevel(3),
  d: setLevel(4),
  e: setLevel(5),
  f: setLevel(6),
  g: setLevel(7),
  h: setLevel(8),
}
console.log(test);