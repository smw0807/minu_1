//서브클래스를 위임으로 바꾸기 - 서브클래스가 하나일 때 
class Booking {
  constructor(show, date) {
    this._show = show;
    this._date = date;
  }
  get hasTalkback() { //7 함수 옮기기를 적용해 메서드를 위임으로 옮긴다.
    // return this._show.hasOwnProperty('talkback') && !this.isPeakDay;
    return (this._premiumDelegate)
      ? this._premiumDelegate.hasTalkback
      : this._show.hasOwnProperty('talkback') && !this.isPeakDay;
  }
  get basePrice() {
    let result = this._show.price;
    if (this.isPeakDay) result += Math.round(result * 0.15);
    return result;
  }
  _bePremium(extras) {
    this._premiumDelegate = new PremiumBookingDelegate(this, extras);
  }
}
class PremiumBooking extends Booking {
  constructor(show, date, extras) {
    super(show, date);
    this._extras = extras;
  }
  // get hasTalkback() { //7 서브클래스의 메서드는 삭제
  //   return this._show.hasOwnProperty('talkback');
  // }
  get basePrice() {
    return Math.round(super.basePrice + this._extras.premiumFee);
  }
  get hasDinner() {
    return this._extras.hasOwnProperty('dinner') && !this.isPeakDay;
  }
}

//생성자를 팩터리 함수로 바꿔서 생성자 호출을 캡슐화
function createBooking(show, date) {
  return new Booking(show, date);
}
function createPremiumBoking(show, date, extras) {
  const result = new PremiumBooking(show, date, extras);
  result._bePremium(extras);
  return result;
}

/**
 * 위임 클래스 만들기
 * 위임 클래스의 생성자는 서브클래스가 사용하던 매개변수와 예약 객체로의 역참조를 매개변수로 받는다.
 * 역참조가 필요한 이유는 서브클래스 메서드 중 슈퍼클래스에 저장된 데이터를 사용하는 경우가 있기 떄문이다.
 */
class PremiumBookingDelegate {
  constructor(hostBooking, extras) {
    this._host = hostBooking;
  }
  get hasTalkback() { //7
    return this._host.hasOwnProperty('talkback');
  }
}