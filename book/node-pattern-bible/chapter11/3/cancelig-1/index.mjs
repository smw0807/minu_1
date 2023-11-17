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
