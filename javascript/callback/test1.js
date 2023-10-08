/**
 * 콜백 함수 실행 후 콜백함수에서 계속 콜백시키면 어떻게되는지 궁금해서...
 */

function run(number, callback) {
  setInterval(() => callback(number), 1000);
}

let num = 0;
run(num, cb => {
  console.log(cb);
});
