/**
 * 임의의 데이터를 생성해줄 함수
 */
import level from 'level';
import sublevel from 'subleveldown';
import nanoid from 'nanoid';

const db = level('example-db');
const salesDb = sublevel(db, 'sales', { valueEncoding: 'json' });
const products = ['book', 'game', 'app', 'song', 'movie'];

async function populate() {
  for (let i = 0; i < 5000; i++) {
    await salesDb.put(nanoid(), {
      amount: Math.ceil(Math.random() * 100),
      product: products[Math.floor(Math.random() * 5)],
    });
  }
  console.log('DB populated');
}
populate();