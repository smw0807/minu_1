/**
 * 프로그래머스 레벨1 신고 결과 받기
 * 
 * 잘만드신 분 예제...............
 */

function solution(id_list, report, k) {
  let reports = [...new Set(report)].map((a) => {
    return a.split(" ");
  });
  console.log(reports);
  let counts = new Map();
  for (const bad of reports) {
    counts.set(bad[1], counts.get(bad[1]) + 1 || 1);
  }
  console.log(counts);
  let good = new Map();
  for (const report of reports) {
    if (counts.get(report[1]) >= k) {
      good.set(report[0], good.get(report[0]) + 1 || 1);
    }
  }
  let answer = id_list.map((a) => good.get(a) || 0);
  return answer;
}

const idArr = ["muzi", "frodo", "apeach", "neo"];
const reportArr = [
  "muzi frodo",
  "apeach frodo",
  "frodo neo",
  "muzi neo",
  "apeach muzi",
];
const a = solution(idArr, reportArr, 2); //기대값 [2,1,1,0]

// const idArr = ["con", "ryan"];
// const reportArr = ["ryan con", "ryan con", "ryan con", "ryan con"];
// const a = solution(idArr, reportArr, 3); //기대값 [0,0]

console.log("a : ", a);
