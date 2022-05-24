class Account {
  constructor() {
    this._daysOverdrawn = '';

  }
  get bankCharge() {
    let result = 4.5;
    if (this._daysOverdrawn > 0) result += this.overdraftCharge;
    return result;
  }
  get overdraftCharge() {
    if (this.type.isPremium) {
      const baseCharge = 10;
      if (this.dayOverdrawn <= 7) {
        return baseCharge;
      } else {
        return baseCharge + (this._daysOverdrawn - 7) * 0.85;
      }
    } else {
      return this.dayOverdrawn * 1.75;
    }
  }
}

class Person {
  constructor(data) {
    this._name = data.name;
    this._age = data.age;
  }

  get name() { return this._name; }
  set name(arg) { this._name = arg; }

  get age() { return this._name; }
  set age(arg) { this._age = arg; }

  info() {
    return this; //constructor 전체 
  }
}

const user = new Person({name: 'smw', age: 31});

const info = user.info();
console.log(info);
