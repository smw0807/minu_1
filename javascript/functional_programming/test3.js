/**
 * 함수형으로 사용함으로써 
 * 복잡해보이지만 코드의 재사용성이 매우 높아짐
 * @param {*} sum 
 * @param {*} count 
 * @returns 
 */
function add(sum, count) {
  console.log('======= add run ======');
  console.log('sum : ', sum);
  console.log('count : ', count);
  sum += count;
  if (count > 0) {
    console.log('count > 0 true : ', sum);
    return add(sum, count - 1)
  } else {
    console.log('else : ', sum);
    return sum;
  }
}
add(0, 10);
/**
======= add run ======
sum :  0
count :  10
count > 0 true :  10
======= add run ======
sum :  10
count :  9
count > 0 true :  19
======= add run ======
sum :  19
count :  8
count > 0 true :  27
======= add run ======
sum :  27
count :  7
count > 0 true :  34
======= add run ======
sum :  34
count :  6
count > 0 true :  40
======= add run ======
sum :  40
count :  5
count > 0 true :  45
======= add run ======
sum :  45
count :  4
count > 0 true :  49
======= add run ======
sum :  49
count :  3
count > 0 true :  52
======= add run ======
sum :  52
count :  2
count > 0 true :  54
======= add run ======
sum :  54
count :  1
count > 0 true :  55
======= add run ======
sum :  55
count :  0
else :  55
 */