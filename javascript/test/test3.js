function run1(name, code) {
  code = code || 1;
  console.log(`name : ${name} 
  code : ${code}`)
}
run1('minwoo');
console.log('--------');
function run2(name, code=1) {
  console.log(`name : ${name} 
  code : ${code}`)
}
run2('minwoo');