function run(meter) {
  if (meter < 1000) return `${meter}m`;
  const k = Math.floor(meter / 1000);
  const m = Math.floor(meter % 1000);
  return `${k}km ${m}m`;
}

console.log(run(1));
console.log(run(60));
console.log(run(654));
console.log(run(2178));
console.log(run(21769));
console.log(run(25271));
