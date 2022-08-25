//esm에서 commonjs의 require
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const test = require('./meta.mjs');
console.log(test);
