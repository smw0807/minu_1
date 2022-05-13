/**
 * json 데이터 안에서 원하는 데이터 찾기
 */
const fs = require('fs');
const json = fs.readFileSync('./data.json', 'utf-8');

 function findDocument(aCode) {
  const jsonArr = JSON.parse(json);
  let result = null;
  jsonArr.map( (doc) => {
    if (doc.code === aCode) {
      result =  doc;
    } else {
      searchChildren(doc.children);
    }
  })

  function searchChildren(arr) {
    if (arr.length !== 0) {
      arr.map( (doc) => {
        if (doc.code === aCode) {
          result = doc;
        } else {
          return searchChildren(doc.children);
        }
      })
    }
  }


  return result;
}
console.time('test');
const findData =  findDocument(3)
console.timeEnd('test');
console.log('findData : ', findData);
