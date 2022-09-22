export class TaskQueuePC {
  constructor(concurrency) {
    this.taskQueue = [];
    this.consumerQueue = [];

    // 소비자 생성
    for (let i = 0; i < concurrency; i++) {
      this.consumer();
    }
  }

  async consumer() {
    //1
    while (true) {
      try {
        const task = await this.getNextTask(); //2
        await task(); //3
      } catch (err) {
        console.error(err); //4
      }
    }
  }

  async getNextTask() {
    return new Promise(resolve => {
      if (this.taskQueue.length !== 0) {
        //5
        return resolve(this.taskQueue.shift());
      }
      //6
      this.consumerQueue.push(resolve);
    });
  }

  runTask(task) {
    return new Promise((resolve, reject) => {
      //7
      const taskWrapper = () => {
        const taskPromise = task();
        taskPromise.then(resolve, reject);
        return taskPromise;
      };

      //8
      if (this.consumerQueue.length !== 0) {
        // there is a sleeping consumer available, use it to run our task
        const consumer = this.consumerQueue.shift();
        consumer(taskWrapper);
      } else {
        //9
        // all consumers are busy, enqueue the task
        this.taskQueue.push(taskWrapper);
      }
    });
  }
}
