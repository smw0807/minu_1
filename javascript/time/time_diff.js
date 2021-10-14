const s_date = new Date('2021-10-10 13:13:13');
const e_date = new Date('2021-10-14 12:45:42');
console.log('1 : ', s_date);
console.log('2 : ', e_date);
const date = e_date - s_date;
console.log('3 : ', date);
const day = parseInt(date / (24 * 60 * 60 * 1000));
const hour = Math.floor((date % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const min = Math.floor((date % (1000 * 60 * 60)) / (1000 * 60));
const sec = Math.floor((date % (1000 * 60)) / 1000);
console.log(day, hour, min, sec);
let time_diff = '';
if (day > 0) {
	time_diff += day + '일 '
}
if (hour > 0) {
	time_diff += hour + '시간 ';
}
if (min > 0) {
	time_diff += min + '분 ';
}
time_diff += sec + '초'
console.log(time_diff);