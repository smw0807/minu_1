const { cloneDeep } = require('lodash');
const dataSet = require('./2dataSet');
console.dir(dataSet, {depth: 5});
// console.table(dataSet);
console.log('------------------');
// console.log(dataSet['2022'].usages['2019']['3']);

class CustomerData {
  constructor(data) {
    this._data = data;
  }
  //읽기
  // RawData() { // RawData();
  get RawData() { // RawData;
    return cloneDeep(this._data);
  }
  usage(customerID, year, month) {
    return this._data[customerID].usages[year][month];
  }
  //쓰기
  setUsage(customerID, year, month, amount) {
    this._data[customerID].usages[year][month] = amount;
  }

}

const customer = new CustomerData(dataSet);
const allData_1 = customer.RawData;
console.dir(allData_1, { depth: 5});
// console.log(customer);
const getData = customer.usage('2022', '2019', '5');
console.log(getData);
customer.setUsage('2022', '2019', '5', 10);
const test = customer.usage('2022', '2019', '5');
console.log(getData); //18
console.log(test); //10
console.log('-=========');
const allData_2 = customer.RawData;
console.dir(allData_2, { depth: 5});