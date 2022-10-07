const a = 3;
let num = 0;
const run = setInterval(() => {
  if (num < 80) {
    num += 80 / a;
    console.log(num);
  } else {
    console.log(num);
    clearInterval(run);
  }
}, 300);
