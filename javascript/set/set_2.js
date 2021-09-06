/**
 * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Set
 */
const test = ['minwoo', 'song'];
const test2 = ['minwoo', 'SSong'];
const st = new Set(test);
const st2 = new Set(test2);
const arr = [
  { user_name: 'minwoo', user_age: 30},
  { user_name: 'minwoo', user_age: 30},
  { user_name: 'minwoo1', user_age: 30},
  { user_name: 'minwoo1', user_age: 31},
]
const arr2 = [
  { user_name: 'minwoo', user_age: 30},
  { user_name: 'minwoo1', user_age: 30},
]

const set = new Set(arr);
const set2 = new Set(arr2);
console.log(arr.length);
console.log(set);
console.log(set.size);
// console.log(st.has('minwoo'));
// console.log('-------');
// for (let i of arr) {
//   console.log (i);
// }
Set.prototype.isSuperset = function(subset) {
  for (var elem of subset) {
      if (!this.has(elem)) {
          return false;
      }
  }
  return true;
}

Set.prototype.union = function(setB) {
  var union = new Set(this);
  for (var elem of setB) {
      union.add(elem);
  }
  return union;
}

Set.prototype.intersection = function(setB) {
  var intersection = new Set();
  for (var elem of setB) {
      if (this.has(elem)) {
          intersection.add(elem);
      }
  }
  return intersection;
}

Set.prototype.difference = function(setB) {
  var difference = new Set(this);
  for (var elem of setB) {
      difference.delete(elem);
  }
  return difference;
}

//Examples
var setA = new Set([1, 2, 3, 4]),
  setB = new Set([2, 3]),
  setC = new Set([3, 4, 5, 6]);
console.log('===========')
console.log(setA.isSuperset(setB)); // => true
console.log(setA.union(setC)); // => Set [1, 2, 3, 4, 5, 6]
console.log(setA.intersection(setC)); // => Set [3, 4]
console.log(setA.difference(setC)); // => Set [1, 2]
console.log(set.union(set2))
console.log(st.union(st2))