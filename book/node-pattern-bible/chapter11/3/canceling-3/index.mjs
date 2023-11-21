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
