import { FailsafeSocket } from './failsafeSocket.js';

const failsafeSocket = new FailsafeSocket({ port: 5001 });
setInterval(() => {
  //현재 메모리 사용량을 전달
  console.log('send...process memory');
  failsafeSocket.send(process.memoryUsage());
}, 1000);
/**
 * 처음 클라이언트만 실행 시
 * FailsafeSocket 초기화 떄 changeState 함수가 실행되고 현재 상태는 오프라인임
 * 서버가 켜질 때까지 계속 activate 함수가 실행되고 메모리 사용량은 대기열에 쌓임
 */
