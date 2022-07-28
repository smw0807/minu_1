const crypto = require('crypto');

const pass = 'pass';
const salt = 'salt';
const start = Date.now();

crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
  const end = Date.now();
  console.log(`1 : ${(end - start) / 1000} s`);
})
crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
  const end = Date.now();
  console.log(`2 : ${(end - start) / 1000} s`);
})
crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
  const end = Date.now();
  console.log(`3 : ${(end - start) / 1000} s`);
})
crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
  const end = Date.now();
  console.log(`4 : ${(end - start) / 1000} s`);
})
crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
  const end = Date.now();
  console.log(`5 : ${(end - start) / 1000} s`);
})
crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
  const end = Date.now();
  console.log(`6 : ${(end - start) / 1000} s`);
})
crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
  const end = Date.now();
  console.log(`7 : ${(end - start) / 1000} s`);
})