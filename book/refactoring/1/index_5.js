//volumeCredits 변수 제거하기
const a = require('./invoices.json');
const b = require('./plays.json');

function palyFor(aPerformance) {
  return b[aPerformance.playID];
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(aNumber/100);
}

function totalVolumCredits() {
  let volumeCredits = 0; //변수 선언(초기화)을 반복문 앞으로 이동?
  for(let perf of a.performances) {
    volumeCredits += volumeCreditsFor(perf);
  }
  return volumeCredits;
}

function volumeCreditsFor(aPerformance) {
  let volumeCredits = 0;
  //포인트 적립
  volumeCredits += Math.max(aPerformance.audience - 30, 0);
  //희극 관객 5명마다 추가 포인트 제공
  if (palyFor(aPerformance).type === 'comedy') volumeCredits += Math.floor(aPerformance.audience / 5);
  return volumeCredits;
}

function amountFor(aPerformance) { // 명확한 이름으로 변경
  let result = 0; //명확한 이름으로 변경
  switch(palyFor(aPerformance).type) { //희극 장르
    case "tragedy":
      result = 40000; //가격
      if (aPerformance.audience > 30) { //청중이 30명보다 클 때
        result += 1000 * (aPerformance.audience - 30); //25
      }
      break;
    case "comedy":
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);//난 이 부분이 이해가 잘 안됨. 20명보다 많으면 인원수에서 20을 뺀다??
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르 : ${palyFor(perf).type}`);
  }
  return result;
}

/**
 * performances : 공연
 * audience : 청중
 * @param {*} invoice 희극 및 청중수 
 * @param {*} plays 희극 및 장르
 */
 function statement(invoice) {
  let totalAccount = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  /**
   * 이 for문과 totalVolumCredits의 for문은 사실상 같은 for문을(반복문을) 쪼개서 반복문이 중복되는거라
   * 성능에 영향을 줄 수 있다고 생각할 수 있지만, 미미하다고함...
   * '경험 많은 프로그래머조차 코드의 실제 성능을 정확히 예측하지 못한다'
   * '소프트웨어 성능은 대체로 코드의 몇몇 작은 부분에 의해 결정되므로 그 외의 부분은 수정한다고 해도 성능 차이를 체감할 수 없다'
   */
  for(let perf of invoice.performances) {
    //청구내역 출력
    result += ` ${palyFor(perf).name} : ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    totalAccount += amountFor(perf);
  }
  // let volumeCredits = totalVolumCredits();
  result += `총액 : ${usd(totalAccount)}\n`;
  result += `적립 포인트: ${totalVolumCredits()}점\n`;
  return result;
}
const run = statement(a, b);
console.log(run);
/**
 * 여기까지 리팩터링 순서
 * 1. '반복문 쪼개기'로 변수 값을 누적시키는 부분을 분리한다.
 * 2. '문장 슬라이드하기'로 변수 초기화 문장을 변수 값 누적 코드 바로 앞으로 옮긴다.
 * 3. '함수 추출하기'로 적립 포인트 계산 부분을 변도 함수로 추출한다.
 * 4. '변수 인라인하기'로 volumeCredits 변수를 제거한다.
 */