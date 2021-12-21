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
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  /**
   * 임시 변수는 나중에 문제를 일으킬 수 있다.
   * 임시 변수는 자신이 속한 루틴에서만 의미가 있어서 루틴이 길고 복잡해지기 쉽다.
   */
  // const format = new Intl.NumberFormat("en-US", {
  //   style: "currency",
  //   currency: "USD",
  //   minimumFractionDigits: 2
  // }).format;

  for(let perf of invoice.performances) {
    // let thisAmount = amountFor(perf);//변수 인라인하기
    volumeCredits += volumeCreditsFor(perf);

    //청구내역 출력
    result += ` ${palyFor(perf).name} : ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    totalAccount += amountFor(perf);
  }
  result += `총액 : ${usd(totalAccount)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

const run = statement(a, b);
console.log(run);