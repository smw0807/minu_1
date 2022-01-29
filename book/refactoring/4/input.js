const readline = require('readline');

/**
 * province 지역
 * demand 수요
 * price 가격
 * cost: 비용
 * producer 생산자
 * production 생산량
 * full revenue 수익
 * shortfail 부족분
 * profit 총수익
 */

function sampleProvinceData(){
  return {
    name: 'Asia',
    producers: [
      {name: "Byzantium", cost: 10, prduction: 9},
      {name: "Attalia", cost: 12, prduction: 10},
      {name: "Sinope", cost: 10, prduction: 6}
    ],
    demand: 30,
    price: 20
  }
}

//데이터 접근자
class Province {
  constructor(doc) {
    this._name = doc.name;
    this._producers = [];
    this._totalProduction = 0;
    this._demand = doc.demand;
    this._price = doc.price;
    doc.producers.forEach(d => this.addProducer(new Producer(this, d)));
  }

  addProducer(arg) {
    this._producers.push(arg);
    this._totalProduction += arg.production;
  }

  get name() { return this._name; }
  get producers() { return this._producers; }
  get totalProduction() { return this._totalProduction; }
  set totalProduction(arg) { this._totalProduction = arg; }
  get demand() { return this._demand; }
  set demand(arg) { this._demand = parseInt(arg); }
  get price() { return this._price; }
  set price(arg) { this._price = parseInt(arg); }

}

//단순 데이터 저장소
class Producer {
  constructor(aProvince, data) {
    this._province = aProvince;
    this._cost = data.cost;
    this._name = data.name;
    this._production = data.production || 0;
  }

  get name() { return this._name; }
  get cost() { return this._cost; }
  set cost(arg) { this._cost = parseInt(arg); }

  get production () { return this._production; }
  set production (amountStr) {
    const amount = parseInt(amountStr);
    const newProduction = Number.isNaN(amount) ? 0 : amount;
    this._province.totalProduction += newProduction - this._production;
    this._production = newProduction;
  }
}


// const readlineInterface = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// })

// readlineInterface.question('input : ', (answer) => {
//   console.log(answer);
//   const str = answer;
//   readlineInterface.close();
// })
