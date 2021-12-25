const a = require('./invoices.json');
const b = require('./plays.json');

/**
{
  customer: 'BigCo',
  performances: [
    { playID: 'hamlet', audience: 55 },
    { playID: 'as-like', audience: 35 },
    { playID: 'othello', audience: 40 }
  ]
}
{
  hamlet: { name: 'Hamlet', type: 'tragedy' },
  'as-like': { name: 'As You Like It', type: 'comedy' },
  othello: { name: 'Othello', type: 'tragedy' }
}
 */
module.exports = function createStatementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance) //얕은 복사
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  };

  function playFor(aPerformance) {
    return b[aPerformance.playID];
  };

  function amountFor(aPerformance) { // 명확한 이름으로 변경
    let result = 0; //명확한 이름으로 변경
    switch(playFor(aPerformance).type) { //희극 장르
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
        throw new Error(`알 수 없는 장르 : ${playFor(perf).type}`);
    }
    return result;
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0;
    //포인트 적립
    result += Math.max(aPerformance.audience - 30, 0);
    //희극 관객 5명마다 추가 포인트 제공
    if (playFor(aPerformance).type === 'comedy') result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function totAmount(data) {
    return data.performances.reduce( (total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce( (total, p) => total + p.volumeCredits, 0);
  }
  
  
  
  
  
}