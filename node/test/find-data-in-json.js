/**
 * json 데이터 안에서 원하는 데이터 찾기
 */
const fs = require('fs');
const json = fs.readFileSync('./data.json', 'utf-8');

 function findDocument(aCode) {
  console.log(aCode);
  const jsonArr = JSON.parse(json);
  let result = null;
  result = jsonArr.find( (doc, idx) => {
    if (doc.code === aCode) {
      return doc;
    } else {
      const data = searchChildren(doc.children);
      console.log('e',data);
      if (data) {
        return data;
      }
    }
  })

  function searchChildren(arr) {
    let rt = null;
    if (Array.isArray(arr)) {
      rt = arr.find( (doc) => {
        if (doc.code === aCode) {
          console.log('c', doc);
          return doc;
        } else {
          return searchChildren(doc.children);
        }
      })
      console.log('d', rt);
      return rt;
    }
  }


  return result;
}

const findData =  findDocument(3)
console.log('findData : ', findData);
