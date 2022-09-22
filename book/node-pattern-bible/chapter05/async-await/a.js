async function a() {
  return true;
}

const val = a();
console.log(val);
if (val) {
  console.log('true');
} else {
  console.log('false');
}
