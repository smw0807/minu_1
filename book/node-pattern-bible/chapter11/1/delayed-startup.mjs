import { once } from 'events';
import { db } from './db.mjs';

async function initialize() {
  db.connect();
  await once(db, 'connected');
}

async function updateLastAccess() {
  await db.query(`INSERT (${Date.now()}) INTO "LastAccesses"`);
}

initialize().then(() => {
  updateLastAccess();
  setTimeout(() => {
    updateLastAccess();
  }, 600);
});
