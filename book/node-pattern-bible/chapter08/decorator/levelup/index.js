import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import level from 'level';
import { levelSubscribe } from './level-subscribe.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dbPath = join(__dirname, 'db');
const db = level(dbPath, { valueEncoding: 'json' }); // ①
levelSubscribe(db); // ②

// ③
db.subscribe({ doctype: 'tweet', language: 'en' }, (k, val) => console.log(k, val));
// ④
db.put('1', {
  doctype: 'tweet',
  text: 'Hi',
  language: 'en',
});
db.put('2', {
  doctype: 'company',
  name: 'ACME Co.',
});
db.put('3', {
  doctype: 'tweet',
  text: 'Bye!!',
  language: 'en',
});
/*
1 { doctype: 'tweet', text: 'Hi', language: 'en' }
3 { doctype: 'tweet', text: 'Bye!!', language: 'en' }
*/

/*
1. 먼저 LevelUP 데이터베이스를 초기화 하고 파일이 저장되는 디렉터리와 값을 위한 기본 인코딩을 선택한다.
2. 원래 db 객체를 데코레이트하는 플러그인을 연결한다.
3. 이제 플러그인에서 제공하는 새로운 기능인 subscribe() 함수를 사용할 준비가 되었다.
  여기서 doctype: ‘tweet’ 및 language: ‘en’을 사용하는 모든 입력 객체를 구독할 것임을 지정한다.
4. 끝으로 put을 사용하여 데이터베이스에 몇몇 값을 저장한다.
  첫 번째, 세 번째 호출은 구독과 관련된 콜백을 실행하고 콘솔에 저장된 객체가 인쇄되는 것을 볼 수 있다.
  이 경우 객체가 구독 패턴과 일지하기 때문이다.
  두 번째 호출은 저장된 객체가 구독 패턴과 일치하지 않기 때문에 출력이 생성되지 않는다.
*/
