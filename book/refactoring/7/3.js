class Order {
  constructor(data) {
    this._priority = data.priority;
  }
  get priority() { return this._priority; }
  get priorityString() { return this._priority.toString(); }
  // set priority(aString) { this._priority = aString; }
  set priority(aString) { this._priority = new Priority(aString); }
}

class Priority {
  constructor(value) {
    this._value = value;
  }
  toString() { return this._value; }
}


const data1 = {
  name : 'minwoo1',
  priority: 1
}
const data2 = {
  name : 'minwoo2',
  priority: 2
}

const order1 = new Order(data1);
console.log(order1);
console.log(order1.priority); //integer 
console.log(order1.priorityString);//string
console.log('------');
data1.priority ='2'
order1.priority = '2';
console.log(order1.priority); //integer 
console.log(order1.priorityString);//string
console.log('===========');
const order2 = new Order(data2);
console.log(order2);
console.log(order2.priority);
console.log(order2.priorityString);