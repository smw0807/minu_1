exports.flatmap = function (data) {
  let rt = data.hits.hits.flatMap( (doc) => {
    let d = {};
    d._index = doc._index;
    d._id = doc._id
    d.type = doc._source.type;
    let key = Object.keys(doc._source.type);
    let val = doc._source[doc._source.type];
    for (key in val) {
      d[key] = val[key];
    }
    return d;
  })
  return rt;
}

exports.singleFlatMap = function (data) {
  let rt = data.hits.hits.flatMap( (doc) => {
    let d= {};
    d._index = doc._index;
    d._id = doc._id;
    let key = Object.keys(doc._source);
    let val = doc._source;
    for (key in val) {
      d[key] = val[key];
    }
    return d;
  });
  return rt;
}

