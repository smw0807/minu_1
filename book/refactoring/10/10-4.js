class Bird {
  constructor(birdObject) {
    Object.assign(this, birdObject);
  }

  get plumage() {
    return '알 수 없다';
  }

  get airSpeedVelocity() {
    switch(this.type) {
      case 35:
        return '보통이다';
      case 40 - 2 * this.numberOfCounts:
        return (bird.numberOfCounts > 2) ? '지쳤다' : '보통이다';
      case '노르웨이 파랑 앵무':
        return (this.isNailed) ? 0 : 10 + this.voltage / 10;
      default:
        return null;
    }
  }
}


//서브클래스의 인스턴스를 만들어줄 팩터리 함수?
function plumage(bird) {
  return createBird(bird).plumage;
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
}
//종별 서브클래스
class AfricanSwallow extends Bird {
  get plumage() {
    return (this.numberOfCounts > 2) ? '지쳤다' : '보통이다';
  }
}
//종별 서브클래스
class NorwegianBlueParrot extends Bird {
  get plumage() {
    return (this.voltage > 100) ? '그을렸다' : '예쁘다';
  }
}