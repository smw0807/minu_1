import { createPostStatusCmd } from './createPostStatusCmd.js';
import { statusUpdateService } from './statusUpdateService.js';
import { Invoker } from './invoker.js';

const invoker = new Invoker();
// 상태 메세지 게시를 나타내는 명령 만들기
const command = createPostStatusCmd(statusUpdateService, 'HI!');
// 명령 실행
invoker.run(command);
// 명령 취소 및 이전 상태로 되돌림
invoker.undo();
// 3초 후 메세지를 보내도록 예약
invoker.delay(command, 1000 * 3);
// 작업을 다른 컴퓨터로 마이그레이션하여 애플리케이션의 부하를 분산
invoker.runRemotely(command);
