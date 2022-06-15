/**
 * 프로그래머스 레벨1 오픈채팅방
 * 내가 짠 소스...
 */

const User = new Map();
function solution(record) {
  var answer = [];
  //유저 정보 세팅
  for (const r of record) {
    const [ event, uid, nickName ] = r.split(' ');
    if (event === 'Enter' || event === 'Change') {
      User.set(uid, nickName ?? User.get(uid));
    }
  }
  for (const r of record) {
    const [ event, uid, nickName ] = r.split(' ');
    if (event === 'Enter') {
      answer.push(`${User.get(uid)}님이 들어왔습니다.`);
    }
    if (event === 'Leave') {
      answer.push(`${User.get(uid)}님이 나갔습니다.`);
    }
  }
  console.log(answer);
  return answer;
}




const data = ["Enter uid1234 Muzi", "Enter uid4567 Prodo","Leave uid1234","Enter uid1234 Prodo","Change uid4567 Ryan"];
solution(data);