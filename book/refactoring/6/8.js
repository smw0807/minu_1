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

class NumberRange {
  constructor(min, max) {
    this._data = {
      min: min,
      max: max
    }
  }

  get min() { return this._data.min; }
  get max() { return this._data.max; }

  contains(arg) {
    return (arg >= this.min && arg <= this.max);
  }
}

function readingOutsideRange(station, range) {
  console.log(range);
  return station.readings.filter( r => !range.contains(r.temp));
}

const range = new NumberRange(45, 50);
const run = readingOutsideRange(station, range);
console.log(run);

