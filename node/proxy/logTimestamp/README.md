# prox 예제 만들어보기

Node.js 디자인 패턴 바이블 책 읽던 중

```text
로그에 출력할 메시지에 현재 타입스탬프를 추가하여 모든 로깅 함(log(), error(), debug(), info())의 기능을 개선하도록 console 객체에 대한 프록시를 만드세요. 예를 들어, consoleProxy.log('hello')를 실행하면 콘솔에 "2020-02-18ㅆ15:59:30.699Z hello"와 같은 내용이 출력되어야 합니다.
```

이 연습 문제를 만들기 위해 만들어봄