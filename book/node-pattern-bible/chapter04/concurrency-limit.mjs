/**
 * 동시성 제한 예제
 */

function makeSampleTask(name) {
  return cb => {
    console.log(`${name} started`);
    setTimeout(() => {
      console.log(`${name} completed`);
      cb();
    }, Math.random() * 2000);
  };
}

const tasks = [
  makeSampleTask('Task 1'),
  makeSampleTask('Task 2'),
  makeSampleTask('Task 3'),
  makeSampleTask('Task 4'),
  makeSampleTask('Task 5'),
  makeSampleTask('Task 6'),
  makeSampleTask('Task 7'),
];
const concurrency = 2;
let running = 0;
let completed = 0;
let index = 0;

/**
 * 1. next()라는 반복 함수가 있으며,
 * 동시성 제한 내에서 가능한 많은 작업을 병렬로 생성하는 내부 루프가 있다.
 */
function next() {
  while (running < concurrency && index < tasks.length) {
    const task = tasks[index];
    /**
     * 작업을 넘겨주는 콜백이다.
     * 콜백은 리스트에 모든 작업을 완료했는지 검사한다.
     * 실행할 작업이 있으면 next()를 호출하여 다른 작업을 생성한다.
     */
    task(() => {
      if (++completed === tasks.length) {
        return finish();
      }
      running--;
      next();
    });
    index++;
    running++;
  }
}
next();

function finish() {
  console.log('finish...');
}
