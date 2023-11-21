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
