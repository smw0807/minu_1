function* fibonacciGenerator() {
  let [prev, current] = [0, 1];
  while (true) {
    yield current;
    [prev, current] = [current, prev + current];
  }
}

const fibonacci = fibonacciGenerator();

// 첫 10개의 피보나치 수 출력
for (let i = 0; i < 10; i++) {
  console.log(fibonacci.next());
  // console.log(fibonacci.next().value);
}
