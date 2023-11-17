# 11-3 비동기 작업 취소

오래 실행되는 작업을 중지할 수 있는 기능은 사용자가 작업을 취소하거나 중복된 작업이 실행될 경우에 특히 유용하다.  
다중 스레드 프로그래밍에서는 스레드를 종료할 수 있지만 Node.js와 같은 단일 스레드 플랫폼에서는 상황이 조금 더 복잡해질 수 있다.

## 11-3-1 취소 가능한 함수를 만들기 위한 기본 레시피

실제 비동기 프로그래밍에서 함수 실행을 취소하는 기본 원칙은 매우 간단하다.  
모든 비동기 호출 후 작업 취소가 요청되었는지 확인하고 그럴 경우 작업을 조기에 종료한다.

```jsx
import { asyncRoutine } from './asyncRountine.mjs';
import { CancelError } from './cancelErro.mjs';

async function cancelable(cancelObj) {
  const resA = await asyncRoutine('A');
  console.log(resA);
  if (cancelObj.cancelRequested) {
    throw new CancelError();
  }

  const resB = await asyncRoutine('B');
  console.log(resB);
  if (cancelObj.cancelRequested) {
    throw new CancelError();
  }

  const resC = await asyncRoutine('C');
  console.log(resC);
}

const cancelObj = { cancelRequested: false };
cancelable(cancelObj).catch(err => {
  if (err instanceof CancelError) {
    console.log('function canceled');
  } else {
    console.error(err);
  }
});

setTimeout(() => {
  cancelObj.cancelRequested = false;
}, 100);
```

cancelable() 함수는 cancelRequested라는 하나의 속성을 가진 객체를 입력으로 받는다.  
함수에서 모든 비동기 호출 후 cancelRequested 속성을 확인하고 이것이 참이면, 전용 CancelError 예외를 발생시켜서 함수를 실행을 중단한다.
