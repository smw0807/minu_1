class Bird {
  constructor(birdObject) {
    Object.assign(this, birdObject);
  }

  get plumage() {
    return '알 수 없다';
  }

  get airSpeedVelocity() {
    return null;
  }
}


//서브클래스의 인스턴스를 만들어줄 팩터리 함수?
function plumage(birds) {
  // return createBird(birds).plumage;
  return new Map(birds
    .map(b => createBird(b))
    .map(bird => [bird.name, bird.plumage]));
}
function speeds(birds) {
  return new Map(birds
    .map(b => createBird(b))
    .map(bird => [bird.name, bird.airSpeedVelocity]));
}

//서브클래스의 인스턴스를 만들어줄 팩터리 함수?
function airSpeedVelocity(bird) {
  return createBird(bird).airSpeedVelocity;
}
//서브클래스의 인스턴스를 만들어줄 팩터리 함수?
function createBird(bird) {
  switch(bird.type) {
    case '유럽 제비':
      return new EuropeanSwallow(bird);
    case '아프리카 제비':
      return new AfricanSwallow(bird);
    case '노르웨이 파랑 앵무':
      return new NorwegianBlueParrot(bird);
    default:
      return new Bird(bird);
  }
}
//종별 서브클래스
class EuropeanSwallow extends Bird {
  get plumage() {
    return '보통이다';
  }
  get airSpeedVelocity() {
    return 35;
  }
}
//종별 서브클래스
class AfricanSwallow extends Bird {
  get plumage() {
    return (this.numberOfCounts > 2) ? '지쳤다' : '보통이다';
  }
  get airSpeedVelocity() {
    return 40 - 2 * this.numberOfCounts;
  }
}
//종별 서브클래스
class NorwegianBlueParrot extends Bird {
  get plumage() {
    return (this.voltage > 100) ? '그을렸다' : '예쁘다';
  }
  get airSpeedVelocity() {
    return (this.isNailed) ? 0 : 10 + this.voltage / 10;
  }
}

const a1 = {
  type: '유럽 제비',
  numberOfCounts: 1,
  voltage: 50,
  isNailed: true
}
const bird_1 = new NorwegianBlueParrot(a1);
console.log(bird_1);
console.log(bird_1.plumage);
console.log(bird_1.airSpeedVelocity);
