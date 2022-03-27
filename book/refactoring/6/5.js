//매개변수 객체 만들기
const station = {
  name: 'minwoo',
  readings: [
    { temp: 47, time: '2022-03-27 09:10' },
    { temp: 53, time: '2022-03-27 09:20' },
    { temp: 48, time: '2022-03-27 09:30' },
    { temp: 43, time: '2022-03-27 09:40' },
    { temp: 41, time: '2022-03-27 09:50' }
  ]
}

function readingOutsideRange(station, min, max) {
  return station.readings.filter( r => r.temp < min || r.temp > max);
}

const run = readingOutsideRange(station, 45, 50);
console.log(run);

