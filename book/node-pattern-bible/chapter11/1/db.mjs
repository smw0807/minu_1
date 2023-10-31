import { EventEmitter } from 'events';

class DB extends EventEmitter {
  connected = false;

  connect() {
    // 연결 지연 시뮬레이션
    setTimeout(() => {
      this.connected = true;
      this.emit('connected');
    }, 500);
  }

  async query(queryString) {
    if (!this.connected) {
      throw new Error('Not connected yet.');
    }
    console.log(`Query executed: ${queryString}`);
  }
}

export const db = new DB();
