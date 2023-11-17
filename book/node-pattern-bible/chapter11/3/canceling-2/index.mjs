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
