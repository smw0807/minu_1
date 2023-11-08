//totalSales.js
import level from 'level';
import sublevel from 'subleveldown';

const db = level('example-db');
const salesDb = sublevel(db, 'sale', { valueEncoding: 'json' });

export async function totalSales(product) {
  console.group('totalSales');
  console.log('product : ', product);
  const now = Date.now();
  let sum = 0;
  for await (const transaction of salesDb.createValueStream()) {
    console.log('transaction : ', transaction);
    if (!product || transaction.product == product) {
      sum += transaction.amount;
    }
  }
  console.log(`totalSales() took: ${Date.now() - now}ms`);
  console.groupEnd();
  return sum;
}
