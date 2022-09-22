function delay(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

async function a() {
  while (true) {
    await delay(1);
    console.log(`Tick ${Date.now()}`);
    console.log(process.cpuUsage());
  }
}
async function b() {
  await delay(1);
  console.log(`Tick ${Date.now()}`);
  console.log(process.cpuUsage());
  return b();
}
a();
// b();
