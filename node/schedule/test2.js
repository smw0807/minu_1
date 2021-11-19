const s = require('node-schedule');
const time = require('moment');

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time * 1000);
  })
}

function test (cnt) {
  return new Promise(async (resolve, reject) => {
    console.log('test start : ', time().format('YYYY-MM-DD HH:mm:ss'), cnt);
    await sleep(20);
    console.log('test end : ', time().format('YYYY-MM-DD HH:mm:ss') , cnt);
    resolve(cnt);
  });
}

let cnt = 0;
const t = s.scheduleJob("*/10 * * * * * ", async function () {
  cnt++;
  let tt = await test(cnt);
  console.log('scheduleJob end : ', tt);
  
})

/**
 * 결과
test start :  2021-11-19 12:21:50 1
test start :  2021-11-19 12:22:00 2
test start :  2021-11-19 12:22:10 3
test end :  2021-11-19 12:22:10 1
scheduleJob end :  1
test start :  2021-11-19 12:22:20 4
test end :  2021-11-19 12:22:20 2
scheduleJob end :  2
test start :  2021-11-19 12:22:30 5
test end :  2021-11-19 12:22:30 3
scheduleJob end :  3
test start :  2021-11-19 12:22:40 6
test end :  2021-11-19 12:22:40 4
scheduleJob end :  4
test start :  2021-11-19 12:22:50 7
test end :  2021-11-19 12:22

스케줄잡이 실행한 함수의 로직이 끝나지 않아도 스케줄잡의 싫행시간이 되면 따로 또 돌림.
이후에 따로따로 결과가 나옴.
 */