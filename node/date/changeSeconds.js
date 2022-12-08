const day = require('dayjs');
function run(seconds) {
  if (seconds < 60) return `${seconds}초`;

  let m = Math.floor(seconds / 60);
  let s = Math.floor(seconds % 60);
  if (m < 60) {
    return `${m}분 ${s}초`;
  }

  let h = Math.floor(seconds / 3600);
  m = Math.floor((seconds % 3600) / 60);
  // const m = Math.floor(((seconds % 3600) % 3600) / 60);
  s = Math.floor(seconds % 60);
  // const s = Math.floor(((seconds % 3600) % 3600) % 60);
  if (h < 24) {
    return `${h}시간 ${m}분 ${s}초`;
  }
  const d = Math.floor(seconds / (3600 * 24));
  h = Math.floor((seconds % (3600 * 24)) / 3600);
  return `${d}일 ${h}시간 ${m}분 ${s}초`;
}

console.log(run(120)); //2분 0초
console.log(run(30)); //30초
console.log(run(12482)); //3시간 28분 2초
console.log(run(222222)); //2일 13시간 43분 42초
console.log(run(20126)); //5시간 35분 26초
console.log(run(20100)); //5시간 35분 0초
