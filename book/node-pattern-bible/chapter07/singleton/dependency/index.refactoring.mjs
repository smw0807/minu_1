import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Blog } from './blog.refactoring.mjs';
import { createDb } from './db.refactoring.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const db = createDb(join(__dirname, 'data.sqlite'));
  const blog = new Blog(db);
  await blog.initialize();
  const posts = await blog.getAllPosts();
  if (posts.length === 0) {
    console.log('No post available. Rune `node import-posts.js` to load some sample posts');
  }
  for (const post of posts) {
    console.log('-'.repeat(post.title.length));
    console.log(post.title);
    console.log(`Published on ${new Date(post.created_at).toISOString()}`);
    console.log(post.content);
    console.log('-'.repeat(post.title.length));
  }
}

main().catch(console.error);
