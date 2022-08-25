import { fileURLToPath } from 'url';
import { dirname } from 'path';
console.log(import.meta);
console.log(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log('__filename : ', __filename);
console.log('__dirname : ', __dirname);
