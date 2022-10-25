function run(angle) {
  // var answer = 0;
  // if (angle > 0 && angle < 90) {
  //   answer = 1;
  // } else if (angle === 90) {
  //   answer = 2;
  // } else if (angle > 90 && angle < 180) {
  //   answer = 3;
  // } else if (angle === 180) {
  //   answer = 4;
  // }

  // return answer;
  // const a = [0, 90, 91, 180].filter(x => {
  //   return angle >= x;
  // });
  return [0, 90, 91, 180].filter(x => angle >= x).length;
}

console.log(run(70));
console.log(run(91));
console.log(run(180));
