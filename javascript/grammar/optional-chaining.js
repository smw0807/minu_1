/**
 * optional chaining 연산자
 * ?. 왼쪽이 null, undefined면 점안찍어주고 undefined 남겨줌?
 * 
 * 중첩된 object 자료에서 자료뽑을 때 reference 에러 없이 안전하게 뽑을 수 있음.
 * . 이 2개 이상일 떄 ? 붙이는게 맞음
 *  1개일 때는 안써도 undefined 뜸
 */
let user = {
  name : 'song',
  // age : 31
  // age : { value : 31 }
}

console.log(user.name);
console.log(user.age); //없으면 undefined 출력됨 1뎁스에선 에러안뜸?
// console.log(user.age.value); // 없으면 에러 남
console.log(user.age?.value); // 없으면 undefined 출력. ? 왼쪽이 비었으면 오른쪽을 안해줌

/**
 * html에서도 script에 사용 가능.
 */
// document.querySelector('#a').innerHTML;  //에러
// document.querySelector('#a')?.innerHTML;