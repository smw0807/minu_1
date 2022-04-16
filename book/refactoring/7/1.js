
class Orgnization {
  constructor(data) {
    this._name = data.name;
    this._city = data.city;
  }
  get name() { return this._name; }
  set name(arg) { this._name = arg; }
  
  get city() { return this._city; }
  set city(arg) { this._city = arg; }
}


const org = { name : 'song min woo', city : 'seoul'};
const a = new Orgnization(org);
const tmp = org;

const name = a.name;
org.name = 'min';
console.log(org);
console.log(a);
console.log(tmp);
