import { TaskQueue } from './taskQueue.mjs';

function makeSampleTask(name) {
  return cb => {
    console.log(`${name} started`);
    setTimeout(() => {
      console.log(`${name} completed`);
      cb();
    }, Math.random() * 2000);
  };
}

const queue = new TaskQueue(2);

function task1(cb) {
  console.log('task 1 started');
  queue
    .pushTask(makeSampleTask('task1 -> subtask 1'))
    .pushTask(makeSampleTask('task1 -> subtask 2'));
  setTimeout(() => {
    console.log('task 1 completed');
    cb();
  }, Math.random() * 2000);
}

function task2(cb) {
  console.log('task 2 started');
  queue
    .pushTask(makeSampleTask('task2 -> subtask 1'))
    .pushTask(makeSampleTask('task2 -> subtask 2'))
    .pushTask(makeSampleTask('task2 -> subtask 3'));
  setTimeout(() => {
    console.log('task 2 completed');
    cb();
  }, Math.random() * 2000);
}

queue.pushTask(task1).pushTask(task2);

queue.on('empty', () => {
  console.log('queue is empty');
});
