function maxNumber(...a: number[]): number {
  let result: number = 0;
  for (let i of a) {
    if (i > result) result = i;
  }
  return result;
}

const number = maxNumber(6, 3, 7, 2);
console.log(number);
