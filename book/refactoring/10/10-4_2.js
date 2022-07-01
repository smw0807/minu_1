class Rating {
  constructor(voyage, history) {
    console.log('Rating class start');
    this.voyage = voyage;
    this.history = history;
  }

  get value() {
    const vpf = this.voyageProfitFactor;
    const vr = this.voyageRisk;
    const chr = this.captainHistoryRisk;
    if (vpf * 3 > (vr +chr * 2)) return 'A';
    else return 'B'
  }

  get voyageRisk() {
    let result = 1;
    if (this.voyage.length > 4) result += 2;
    if (this.voyage.length > 8) result += this.voyage.length - 8;
    if (["중국", "동인도"].includes(this.voyage.zone)) result += 4;
    return Math.max(result, 0);
  }

  get captainHistoryRisk() {
    let result = 1;
    if (this.history.length < 5) result += 4;
    result += this.history.filter(v => v.profit < 0).length;
    // if (this.voyage.zone === '중국' && this.hasChinaHistory) result -= 2; //서브클래스에서 오버라이드 시켜서 주석처리
    return Math.max(result, 0);
  }

  get voyageProfitFactor() {
    let result = 2;
    if (this.voyage.zone === '중국') result += 1;
    if (this.voyage.zone === '동인도') result += 1;
    // if (this.voyage.zone === '중국' && this.hasChinaHistory) {
    //   result += 3;
    //   if (this.history.length > 10) result += 1;
    //   if (this.voyage.length > 12) result += 1;
    //   if (this.voyage.length > 18) result -= 1;
    // } else {
    //   if (this.history.length > 8) result += 1;
    //   if (this.voyage.length > 14) result -= 1;
    // }
    result += this.voyageAndHistoryLengthFactor;
    return result;
  }

  get hasChinaHistory() {
    return this.history.some(v => v.zone === '중국');
  }

  get voyageAndHistoryLengthFactor() {
    let result = 0;
    if (this.voyage.zone === '중국' && this.hasChinaHistory) {
      result += 3;
      if (this.history.length > 10) result += 1;
      if (this.voyage.length > 12) result += 1;
      if (this.voyage.length > 18) result -= 1;
    } else {
      if (this.history.length > 8) result += 1;
      if (this.voyage.length > 14) result -= 1;
    }
    return result;
  }
}

function rating(voyage, history) {
  // return new Rating(voyage, history).value;
  return createRating(voyage, history).value;
}
//------------
class ExperiencedChinaRating extends Rating {
  get captainHistoryRisk() {
    const result = super.captainHistoryRisk - 2;
    return Math.max(result, 0);
  }
}

function createRating(voyage, history) {
  if (voyage.zone === '중국' && history.some( v => v.zone === '중국'))
    return new ExperiencedChinaRating(voyage, history);
  else 
    return new Rating(voyage, history);
}



const voyage = {
  zone: '중국', 
  length: 10
}
const history = [
  { zone: '동인도', profit: 5},
  { zone: '서인도', profit: 15},
  { zone: '중국', profit: -2},
  { zone: '서아프리카', profit: 7},
]
// const myRating = new Rating(voyage, history).value;
const myRating = rating(voyage, history).value;
console.log('myRating : ', myRating);