/**
 * Object
 */
let yuJin = {
  name: '안유진',
  group: '아이브',
  dance: function () {
    return '춤추기';
  },
};

console.log(yuJin);
console.log(yuJin.name);
console.log(yuJin.dance());
const key = 'name';
console.log(yuJin[key]);
console.log(Object.keys(yuJin));
console.log(Object.values(yuJin));
console.log(Object.entries(yuJin));
