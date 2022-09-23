async function a() {
  return new Promise((resolve, reject) => {
    console.log('a');
    setTimeout(() => {
      resolve('aaaa');
    }, 3000);
  });
}
async function b() {
  return new Promise((resolve, reject) => {
    console.log('b');
    setTimeout(() => {
      resolve('bbbb');
      // reject('bbbb');
    }, 3000);
  });
}
async function c() {
  return new Promise((resolve, reject) => {
    console.log('c');
    setTimeout(() => {
      resolve('cccc');
    }, 3000);
  });
}

const arr = [];
arr.push(a());
arr.push(b());
arr.push(c());

// arr.forEach(async v => {
//   console.log(await v);
// });

// Promise.all(arr).then(v => {
//   console.log(v);
// });

// async function run() {
//   for (const ar of arr) {
//     console.log(await ar);
//   }
// }
// run();

async function run2() {
  const result = await Promise.all(arr.map(v => v));
  console.log(result);
}
run2();
