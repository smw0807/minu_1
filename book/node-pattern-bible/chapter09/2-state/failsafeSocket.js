import { OfflineState } from './offlineState.js';
import { OnlineState } from './onlineState.js';

export class FailsafeSocket {
  // 1
  constructor(options) {
    this.options = options;
    this.queue = [];
    this.currentState = null;
    this.socket = null;
    this.states = {
      offline: new OfflineState(this),
      online: new OnlineState(this),
    };
    this.changeState('offline');
  }

  // 2
  changeState(state) {
    console.log(`Activating state: ${state}`);
    this.currentState = this.states[state];
    this.currentState.activate();
  }

  // 3
  send(data) {
    this.currentState.send(data);
  }
}
/*
1. 생성자는 소켓이 오프라인일 때 전송된 모든 데이터를 담을 큐를 포함하여 다양한 데이터 구조를 초기화 한다.
  또한 두 가지 상태 집합을 생성한다.
  하나는 오프라인일 때 소켓 동작을 구현하기 위한 것이고, 다른 하나는 소켓이 온라인일 때이다.
2. changeState() 함수는 한 상태에서 다른 상태로 전환하는 역할을 한다.
  단순히 currentState 인스턴스 변수를 업데이트하고 대상 상태에서 activate()를 호출한다.
3. send() 함수에서는 FailsafeSocket 클래스의 주요 기능이 포함되어 있다.
  온라인, 오프라인 상태에 따라 다른 동작을 처리하는 곳이다.
  현재 활성 상태로 작업을 위임하면 된다.
*/
