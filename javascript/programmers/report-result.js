/**
 * 프로그래머스 레벨1 신고 결과 받기
 * 내가 짠 소스...
 */
const id = new Map();

function solution(id_list, report, k) {
  var answer = [];

  //id_list 데이터로 id map 생성
  setIdMap(id_list);
  //report 값을 토대로 id map에 id별로 신고 당한 횟수, 신고한 사람 추가
  setReportData(report);

  setTargetCount(k);

  id.forEach((v, i, m) => {
    answer.push(v.targetCount);
  });
  return answer;
}

function setIdMap(id_list) {
  for (const i of id_list) {
    id.set(i, {
      reportCount: 0, //신고당한 횟수
      reportUser: [], //신고한 사람
      targetCount: 0, //신고 횟수
    });
  }
}

function setReportData(report) {
  for (const r of report) {
    const rpUser = r.split(" ")[0]; //신고자
    const badUser = r.split(" ")[1]; //신고 대상자
    if (id.has(rpUser) && id.has(badUser)) {
      //이용자ID에 둘다 있는 경우에...
      const User = id.get(badUser);
      if (User.reportUser.length === 0) {
        //첫 신고자
        User.reportUser.push(rpUser);
        User.reportCount = 1;
      } else if (User.reportUser.indexOf(rpUser) !== -1) {
        //신고한 적이 있으면 패스... 동일 인물 1회 이상 신고 불가능.
        continue;
      } else {
        User.reportUser.push(rpUser);
        User.reportCount++;
      }
    }
  }
}

function setTargetCount(k) {
  id.forEach((v, i, m) => {
    if (v.reportCount >= k) {
      for (const u of v.reportUser) {
        id.get(u).targetCount++;
      }
    }
  });
}


const idArr = ["muzi", "frodo", "apeach", "neo"];
const reportArr = ["muzi frodo", "apeach frodo", "frodo neo", "muzi neo", "apeach muzi" ];
const a = solution(idArr, reportArr, 2); //기대값 [2,1,1,0]

// const idArr = ["con", "ryan"];
// const reportArr = ["ryan con", "ryan con", "ryan con", "ryan con"];
// const a = solution(idArr, reportArr, 3); //기대값 [0,0]

console.log("a : ", a);
