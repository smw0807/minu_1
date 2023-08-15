/**
 * LevelUP API를 중심으로 어댑터를 만들어 기본 fs 모듈과 호횐되는 인터페이스로 변환
 * readFile(), wrtieFile()에 대한 모든 호출이 db.get(), db.put()에 대한 호출로 변환하도록 한다.
 */
import { resolve } from 'path';

export function createFSAdapter(db) {
  return {
    readFile(filename, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else if (typeof options === 'string') {
        options = { encodding: options };
      }
      //1
      db.get(
        resolve(filename),
        {
          valueEncoding: options.encodding,
        },
        (err, value) => {
          if (err) {
            //2
            if (err.type === 'NotFoundError') {
              err = new Error(`ENOENT, open "${filename}`);
              err.code = 'ENOENT';
              err.errorno = 34;
              err.path = filename;
            }
            //3
            return callback && callback(err);
          }
          callback && callback(null, value);
        }
      );
    },

    writeFile(filename, contents, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else if (typeof options === 'string') {
        options = { encoding: options };
      }

      db.put(
        resolve(filename),
        contents,
        {
          valueEncoding: options.encodding,
        },
        callback
      );
    },
  };
}
/**
1. db 인스턴스에서 파일을 검색하려면 파일 이름을 키로 사용하여 항상 전체 경로를 사용하도록(resolve() 사용) 해서 db.get() 함수를 호출한다.
데이터베이스에서 사용하는 valueEncoding 옵션의 값을 입력에서 받은 인코딩 옵션으로 설정한다.
2. 데이터베이스에 키를 찾을 수 없는 경우 ENOENT를 코드로 하여 오류를 생성한다.
이 코드는 원래 fs 모듈에서 찾을 수 없는 파일을 표시하는데 사용하는 코드임
다른 모든 유형의 오류는 콜백으로 전달된다.
3. 데이터베이스에서 키-값 쌍이 성공적으로 검색되면 콜백을 사용하여 호출자에게 값을 반환한다.
 */
