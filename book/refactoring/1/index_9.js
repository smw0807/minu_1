//totalAccount 변수 제거하기
const a = require('./invoices.json');
const b = require('./plays.json');

const createStatementData = require('./index_9_sub');

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(aNumber/100);
}


 function renderPlainText(data, plays) {
  let result = `청구 내역 (고객명: ${data.customer})\n`;
  for(let perf of data.performances) {
    //청구내역 출력
    result += ` ${perf.play.name} : ${usd(perf.amount)} (${perf.audience}석)\n`;
  }
  result += `총액 : ${usd(data.totalAmount)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
  return result;
}
const run = statement(a, b);
console.log(run);