import { totalSales as totalSalesRaw } from './totalSales.js';

const runningRequests = new Map();

export function totalSales(product) {
  // 1
  console.log('runningRequests.has(product) : ', runningRequests.has(product));
  if (runningRequests.has(product)) {
    console.log('Batching');
    return runningRequests.get(product);
  }

  //2
  const resultPromise = totalSalesRaw(product);
  runningRequests.set(product, resultPromise);
  resultPromise.finally(() => {
    runningRequests.delete(product);
  });

  console.log('resultPromise : ', resultPromise);
  return resultPromise;
}
