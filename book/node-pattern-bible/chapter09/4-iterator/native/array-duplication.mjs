const arrayWithDuplicates = [1, 2, 2, 3, 4, 4, 5];
const uniqArray = Array.from(new Set(arrayWithDuplicates));
console.log(uniqArray); // [1, 2, 3, 4, 5]

const test1 = new Set(arrayWithDuplicates);
console.log(test1); //Set(5) { 1, 2, 3, 4, 5 }
