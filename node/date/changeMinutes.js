function run(minutes) {
  if (minutes < 60) return `${minutes}분`;

  let h = Math.floor(minutes / 60);
  let m = Math.floor(minutes % 60);
  if (h < 24) {
    if (m === 0) return `${h}시간`;
    return `${h}시간 ${m}분`;
  }
  let result = '';
  const day = Math.floor(minutes / 1440);
  h = Math.floor((minutes % 1440) / 60);
  m = Math.floor((minutes % 1440) % 60);
  result = `${day}일 ${h}시간`;
  if (m !== 0) result += ` ${m}분`;
  return result;
}

console.log(run(120)); //2시간
console.log(run(30)); //30분
console.log(run(12482)); //8일 16시간 2분
console.log(run(222222)); //154일 7시간 42분
console.log(run(20126)); //13일 23시간 26분
console.log(run(20100)); //13일 23시간
console.log(run(6147)); //4일 6시간 27분
