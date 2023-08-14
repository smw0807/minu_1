export function levelSubscribe(db) {
  // ① 콜백?
  db.subscribe = (pattern, listener) => {
    // ②
    db.on('put', (key, val) => {
      const match = Object.keys(pattern).every(
        k => pattern[k] === val[k] // ③
      );
      if (match) {
        listener(key, val); // ④
      }
    });
  };

  return db;
}
/**
1. subcribe()라는 새로운 함수로 db 객체를 데코레이트 한다.
  제공된 db 인스턴스에 함수를 직접 연결하기만 하면 된다.(객체 확장)
2. 데이터베이스에서 수행된 모든 입력 작업을 수신한다.
3. 데이터가 입력될 때 제공된 패턴의 모든 속성에 대해 존재여부를 검증하는데 간단한 패턴 매치 알고리즘을 수행한다.
4. 일치하는 속성이 있으면 리스너에게 알린다.
*/
