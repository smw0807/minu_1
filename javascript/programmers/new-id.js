/**
 * 프로그래머스 레벨1 신규 아이디 추천
 * 내가 짠 소스...
 */

function solution(new_id) {
  let answer = new_id.toLowerCase()
              .replace(/[^\\a-z\\0-9\\-\\_\\.]/g, '')
              .replace(/(\.){2,}/g, '.');
  if (answer === '') {
    answer = 'a';
  }
  answer = answer.replace(/^./g, '')
          .replace(/.$/g, '');

  if (answer.length > 15) {
    answer = answer.substring(0, 15);
  }

  

  console.log(answer);
  // const changeLower = new_id.toLowerCase();
  // console.log(changeLower);
  // const dotdot = changeLower.replace(/(\.){2,}/g, '.');
  
  // console.log(dotdot);
  // const delStartDot = dotdot.replace(/^./g, '');
  // console.log(delStartDot);
  // const delEndDot = dotdot.replace(/.$/g, '');
  // console.log(delEndDot);
  // const emptyCheck = delEndDot === '' ? 'a' : delEndDot;
  // console.log(emptyCheck);
  // console.log(emptyCheck.length);
  // let answer = '';
  // const changeLower = new_id.toLowerCase();
  // console.log(changeLower);
  // const dotdot = changeLower.replace(/(\.){2,}/g, '.');

  // console.log(dotdot);
  // const delStartDot = dotdot.replace(/^./g, '');
  // console.log(delStartDot);
  // const delEndDot = dotdot.replace(/.$/g, '');
  // console.log(delEndDot);
  // const emptyCheck = delEndDot === '' ? 'a' : delEndDot;
  // console.log(emptyCheck);
  // console.log(emptyCheck.length);

  return answer;
}

const data = '...!@BaT#*..y.abcdefghijklm.';
// const data = '';
solution(data);