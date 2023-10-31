import { once } from 'events';
import { db } from './db.mjs';

db.connect();

async function updateLastAccess() {
  if (!db.connected) {
    await once(db, 'connected');
  }

  await db.query(`INSERT (${Date.now()}) INTO "LastAccesses"`);
}

updateLastAccess();
setTimeout(() => {
  updateLastAccess();
}, 600);
