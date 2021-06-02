const data = {
  "_index": "test_go",
  "_type": "_doc",
  "_id": "5YsT_HgBmgLtDrVesEqH",
  "_score": 1,
  "_source": {
    "bps": 5052016,
    "cps": 0,
    "link": 2,
    "max_bps": 2888792,
    "min_bps": 498488,
    "pps": 6248,
    "sec": 1619135680
  }
}

const time = data._source.sec;
console.log('time : ', time);
const t = new Date(time * 1000);
console.log('t : ' , t);

console.log('date : ', t.getDate());
console.log('time : ', t.getTime());