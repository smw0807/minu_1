/**
 * 0~19까지의 범위
 * 범위 안에서 숫자를 받으면 해당 값부터 뒤로 10개의 숫자를 구한다.
 * 0에서 더 뒤로가야하면 19부터 다시 시작한다.
 * ex) 4를 받을 경우
 * 4,3,2,1,0,19,18,17,16,15
 */
const arr = [];
function makeArr() {
  for(let i = 0; i < 20; i++) {
    arr.push(i);
  }
}
makeArr();
console.log(arr);

function run(v) {
  const tmp = [];
  let val = v;
  for (let i = 0; i < 10; i++) {
    if (arr[val] === undefined) {
      val = arr.length - 1;
    } 
    tmp.push(arr[val]);
    val--;
  }
  console.log(tmp.toString());
}
run(4);
