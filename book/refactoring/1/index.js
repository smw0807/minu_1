const a = require('./invoices.json');
const b = require('./plays.json');
/**
 * performances : 공연
 * audience : 청중
 * @param {*} invoice 희극 및 청중수 
 * @param {*} plays 희극 및 장르
 */
function statement(invoice, plays) {
  // console.log(invoice);
  // console.log(plays);
  let totalAccount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format;

  for(let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;
    
    /**
     * 장르가 추가될 때마다 case문이 추가되고
     * 그 안에 가격 또한 작성해줘야하는 불편함이 있음.
     */
    switch(play.type) { //희극 장르
      case "tragedy":
        thisAmount = 40000; //가격
        if (perf.audience > 30) { //청중이 30명보다 클 때
          thisAmount += 1000 * (perf.audience - 30); //25
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);//난 이 부분이 이해가 잘 안됨. 20명보다 많으면 인원수에서 20을 뺀다??
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르 : ${play.type}`);
    }
    
    //포인트 적립
    volumeCredits += Math.max(perf.audience - 30, 0);
    //희극 관객 5명마다 추가 포인트 제공
    if (plays.type === 'comedy') volumeCredits += Math.floor(perf.audience / 5);

    //청구내역 출력
    result += ` ${play.name} : ${format(thisAmount/100)} (${perf.audience}석)\n`;
    totalAccount += thisAmount;
  }
  result += `총액 : ${format(totalAccount/100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

const run = statement(a, b);
console.log(run);