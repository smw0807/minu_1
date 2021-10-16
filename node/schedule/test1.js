const s = require('node-schedule');
const time = require('moment');
/**
 * 들어있는 구조
 console.log(s);
 {
  Job: [Function: Job],
  Invocation: [Function: Invocation],
  Range: [Function: Range],
  RecurrenceRule: [Function: RecurrenceRule],
  cancelJob: [Function: cancelJob],
  rescheduleJob: [Function: rescheduleJob],
  scheduledJobs: {},
  scheduleJob: [Function: scheduleJob]

*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

주의할점
second, minute, hour는 입력된 시간마다 실행하는게 아님 (setInterval 개념과 다름)

1초 1초마다 실행되는게 아니라 16:50:01, 16:51:01, 16:52:01 이렇게 실행되는것임
}
 */

console.log('start : ', time().format('YYYY-MM-DD HH:mm:ss'));
const t = s.scheduleJob("5 * * * * * ", function () {
  console.log(time().format('YYYY-MM-DD HH:mm:ss') + ' 매분 5초 마다 실행...');
})

/** 
2021-10-16 17:04:05매분 5초 마다 실행...
2021-10-16 17:05:05매분 5초 마다 실행...
2021-10-16 17:06:05매분 5초 마다 실행...
2021-10-16 17:07:05매분 5초 마다 실행...
2021-10-16 17:08:05매분 5초 마다 실행...
2021-10-16 17:09:05매분 5초 마다 실행...
2021-10-16 17:10:05매분 5초 마다 실행...
2021-10-16 17:11:05매분 5초 마다 실행...
2021-10-16 17:12:05매분 5초 마다 실행...
2021-10-16 17:13:05매분 5초 마다 실행...
2021-10-16 17:14:05매분 5초 마다 실행...
 */