var date = new Date();
// var sdate = '2019-11-25';
// var edate = '2019-11-26';
var sdate = '2019-11-24 11:11:11';
var edate = '2019-11-24 10:01:11';
console.log(sdate);
console.log(edate);
console.log(sdate > edate);
/*
2019-11-24 11:11:11
2019-11-24 10:01:11
true
 */
console.log("----------------");
var test1 = new Date(sdate);
var test2 = new Date(edate);
console.log(test1);
console.log(test2);
console.log(sdate > edate);
/*
2019-11-24T02:11:11.000Z
2019-11-24T01:01:11.000Z
true
*/
