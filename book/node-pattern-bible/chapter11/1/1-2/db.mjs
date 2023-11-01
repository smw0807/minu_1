import { EventEmitter } from 'events';

class DB extends EventEmitter {
  connected = false;
  commandsQueue = [];

  async query(queryString) {
    if (!this.connected) {
      console.log(`Request queued: ${queryString}`);

      //1
      return new Promise((resolve, reject) => {
        const command = () => {
          this.query(queryString).then(resolve, reject);
        };
        console.log('command : ', command);
        this.commandsQueue.push(command);
      });
    }
    console.log(`Query executed: ${queryString}`);
  }

  connect() {
    // simulate the delay of the connection
    setTimeout(() => {
      this.connected = true;
      this.emit('connected');
      this.commandsQueue.forEach(command => command()); //2
      this.commandsQueue = [];
    }, 500);
  }
}

export const db = new DB();
