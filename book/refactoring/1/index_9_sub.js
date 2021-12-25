/**
 * 생성자를 팩터리 함수로 바꾸기?
 */

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
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }
  get amount() {
    throw new Error('서브클래스에서 처리하게 변경됨');
  }
  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

/** 함수를 이용한 서브클래스.
 * 자바스크립트에서는 생성자가 서브클래스의 인스턴스를 반환할 수 없다.
 * 서브클래스를 사용하려면 생성자 대신 함수를 호출하도록 해야한다.
 * ??
 */
function createPerformanceCalculator(aPerformance, aPlay) {
  switch(aPlay.type) {
    case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
    case "comedy": return new ComedyCalculator(aPerformance, aPlay);
    default:
        throw new Error(`알 수 없는 장르 : ${aPlay.type}`);
  }
}

class TragedyCalculator extends PerformanceCalculator{
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) { 
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}
class ComedyCalculator extends PerformanceCalculator{
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }
  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

module.exports = function createStatementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;

  function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance) //얕은 복사
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  };

  function playFor(aPerformance) {
    return b[aPerformance.playID];
  };

  function totAmount(data) {
    return data.performances
    .reduce( (total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(data) {
    return data.performances
    .reduce( (total, p) => total + p.volumeCredits, 0);
  }
}