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

## 11-3-2 비동기 호출 래핑

기초적인 취소 가능한 비동기 함수를 만들고 사용하는 것은 매우 간단하지만, 많은 코드가 추가된다.  
실제로 추가 코드가 너무 많아서 함수의 실제 비즈니스 논리를 식별하기 어렵다.  
비동기 루틴을 호출하는데 사용할 수 있는 래핑 함수 안에 취소 로직을 포함시켜 추가되는 코드를 줄일 수 있다.

```jsx
import { CancelError } from './cancelError.mjs';

export function createCacncelWrapper() {
  let cancelRequested = false;

  function cancel() {
    cancelRequested = true;
  }

  function cancelWrapper(func, ...args) {
    if (cancelRequested) {
      return Promise.reject(new CancelError());
    }
    return func(...args);
  }

  return { cancelWrapper, cancel };
}
```

래퍼는 팩토리 함수를 통해 생성했다.  
팩토리는 비동기 실행 함수를 감싸는 래패 함수(cancelWrapper)와 비동기 작업 취소(cancel)를 트리거하는 함수, 이렇게 두 가지 함수를 반환한다.  
이를 통해 여러 비동기 호출을 감싸는 래퍼 함수를 만든 다음 cancel() 함수 하나를 사용하여 모두 취소할 수 있다.

cancelWrapper 함수는 호출할 함수(func)와 함수에 전달할 일련의 매개 변수들(args)을 입력으로 받는다.  
래퍼는 단순히 취소가 요청되었는지 확인하고, 취소할 수 있는 경우 거부 사유료 CancelError 객체를 사용한 프라미스를 반환한다.  
그렇지 않으면 func를 호출한다.

```jsx
import { asyncRoutine } from './asyncRountine.mjs';
import { createCacncelWrapper } from './cancelWrapper.mjs';
import { CancelError } from './cancelError.mjs';

async function cancelable(cancelWrapper) {
  const resA = await cancelWrapper(asyncRoutine, 'A');
  console.log(resA);
  const resB = await cancelWrapper(asyncRoutine, 'B');
  console.log(resB);
  const resC = await cancelWrapper(asyncRoutine, 'C');
  console.log(resC);
}

const { cancel, cancelWrapper } = createCacncelWrapper();

cancelable(cancelWrapper).catch(err => {
  if (err instanceof CancelError) {
    console.log('Function canceled');
  } else {
    console.log(err);
  }
});

setTimeout(() => {
  cancel();
}, 100);
```

위 코드를 실행하면 A 실행 중 cancel 함수가 실행되면서 B부터는 실행이 취소됨  
setTimeout의 값을 늘릴 수록 뒤에 함수에서 취소되는걸 확인할 수 있다.

## 11-3-3 제너레이터를 사용한 취소 가능한 비동기 함수

11-3-2에서 만든 cancelable 래퍼 함수는 오류가 발생하기 쉬우며(하나의 함수를 감싸는 것을 잊었을 경우…), 코드의 가독성에 영향을 미치므로 크고 복잡한 취소 가능한 비동기 작업을 구현하는 데는 이상적이지 않다.

더 깔끔한 솔루션으로는 제너레이터를 사용하는 방법이 있다.  
제너레이터는 다재다능한 도구이며 모든 종류의 알고리즘을 구현하는데 사용할 수 있다.  
아래 코드는 제너레이터를 사용하여 함수의 비동기 흐름을 제어하는 관리자(supervisor)를 만들어 본 것이다.  
결과적으로 투명하게 취소할 수 있는 비동기 함수이며, 동작은 await 명령어가 yield로 대체되는 비동기 함수와 유사하다.

```jsx
import { CancelError } from './cancelError.mjs';

// 1
export function createAsyncCancelable(generatorFunction) {
  return function asyncCancelable(...args) {
    // 3
    const generatorObject = generatorFunction(...args);
    let cancelRequested = false;

    function cancel() {
      cancelRequested = true;
    }

    const promise = new Promise((resolve, reject) => {
      // 4
      async function nextStep(prevResult) {
        if (cancelRequested) {
          return reject(new CancelError());
        }

        if (prevResult.done) {
          return resolve(prevResult.value);
        }

        try {
          // 5
          nextStep(generatorObject.next(await prevResult.value));
        } catch (err) {
          try {
            //6
            nextStep(generatorObject.throw(err));
          } catch (err2) {
            reject(err2);
          }
        }
      }
      nextStep({});
    });
    // 2
    return {
      promise,
      cancel,
    };
  };
}
```

1. createAsyncCancelable() 함수가 제너레이터 함수(관리 대상 함수)를 입력으로 받아 이 함수를 관리 로직으로 감싸는 또 다른 함수(asyncCancelable())를 반환한다.  
   asyncCancelable() 함수는 비동기 작업을 호출하는데 사용할 것이다.
2. 비동기 작업의 최종 해결(또는 거부)를 포함한 프라미스와 관리 대상의 비동기 흐름을 취소하는데 사용할 수 있는 cancel함수를 반환한다.
3. 호출 시 입력(args)로 받은 인자를 사용하여 제너레이터 함수를 호출하여, 실행 중인 코루틴(coroutine)의 실행 흐름을 제어하는 데 사용할 수 있는 제너레이터 객체를 가져온다.
4. 관리자읜 전체 로직은 관리 대상의 코루틴(prevResult)이 반환하는 값들(yielded)을 반복하는 nextStep() 함수 내에서 구현된다.  
   이 반환값들은 실제 값이나 프라미스일 수 있다.  
   취소가 요청되면 일반적인 CancelError가 발생한다.  
   그렇지 않고 코루틴이 종료될 경우 즉시 바깥쪽 프라미스를 해결(resolve)을 반환하고 완료한다.
5. nextStep() 함수의 핵심 부분은 관리 대상의 코루틴에 의해 생성된 다음 값을 반환받는(yielded) 곳이다.  
   프라미스를 처리할 경우 실제 해결값을 얻을 때까지 값을 기다린다(await).  
   또한 prevResult.value가 프라미스이고 거부된다면 catch 문으로 끝난다.  
   관리 대상 코루틴에 실제 예외가 발생해도 catch 문으로 종료될 수 있다.
6. catch문에서 catch 된 오류를 코루틴 내부로 throw한다.  
   코루틴에 의해 이미 해당 오류가 발생한 경우 불필요하지만, promise 거부의 결과인 경우 그렇지 않다.  
   코루틴 내에서 throw 한 다음에 생성되는 값을 사용하여 nextStep()을 호출하지만, 결과가 또 다른 예외인 경우(예외가 코루틴 내부에서 포착되지 않거나 다른 예외가 발생한 경우) 즉시 외부 promise를 거부하고 비동기 작업을 완료한다.

```jsx
import { asyncRoutine } from './asyncRountine.mjs';
import { createAsyncCancelable } from './createAsyncCancelable.mjs';
import { CancelError } from './cancelError.mjs';

const cancelable = createAsyncCancelable(function* () {
  const resA = yield asyncRoutine('A');
  console.log(resA);
  const resB = yield asyncRoutine('B');
  console.log(resB);
  const resC = yield asyncRoutine('C');
  console.log(resC);
});

const { promise, cancel } = cancelable();

promise.catch(err => {
  if (err instanceof CancelError) {
    console.log('Function canceled');
  } else {
    console.log('err : ', err);
  }
});

setTimeout(() => {
  cancel();
}, 100);
```

await 대신 yield를 사용하는 것을 제외하면 createAsyncCancelable()에 의해 감싸진 제너레이터가 비동기 함수와 매우 유사하다는 것을 즉시 알 수 있을 것이다.  
또한 명시적인 취소 로직이 존재하지 않는다.  
제너레이터 함수는 비동기 함수의 뛰어난 특징을 지니지만(예: 비동기 코드를 동기 코드처럼 보이게 만듬) 비동기 함수와 달리 createAsyncCancelable()에서 도입한 관리자 덕분에 중간에 작업을 취소할 수도 있게 됐다.

또한, createAsyncCancelable()이 다른 함수처럼 호출할 수 있는 함수(cancelable)를 만들지만 동시에 작업 결과를 나타내는 promise와 작업을 취소하는 함수를 반환한다는 것이다.

실제 제품에서 사용하는 경우 대부분 caf(https://www.npmjs.com/package/caf)와 같은 패키지를 사용할 수 있다.
