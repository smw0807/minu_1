import { EventEmitter } from 'events';

const METHODS_REQUIRING_CONNECTION = [`query`];
const deactivate = Symbol('deactivate');

class InitializedState {
  async query(queryString) {
    console.log(`Query executed: ${queryString}`);
  }
}

class QueuingState {
  constructor(db) {
    this.db = db;
    this.commandsQueue = [];

    METHODS_REQUIRING_CONNECTION.forEach(methodName => {
      this[methodName] = function (...args) {
        console.log('Command queued: ', args);
        return new Promise((resolve, reject) => {
          const command = () => {
            db[methodName](...args).thend(resolve, reject);
          };
          console.log('command : ', command);
        });
      };
    });
  }

  [deactivate]() {
    this.commandsQueue.forEach(command => {
      console.log('forEach command : ', command);
      command();
    });
    this.commandsQueue = [];
  }
}

class DB extends EventEmitter {
  constructor() {
    super();
    //1
    this.state = new QueuingState(this);
  }

  async query(queryString) {
    //2
    return this.state.query(queryString);
  }

  connect() {
    // simulate the delay of the connection
    setTimeout(() => {
      this.connected = true;
      this.emit('connected');
      const oldState = this.state; //3
      this.state = new InitializedState(this);
      oldState[deactivate] && oldState[deactivate]();
    }, 500);
  }
}

export const db = new DB();
