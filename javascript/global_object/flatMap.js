let pcData = {
  "aggregations": {
    "idx": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": 6,
          "doc_count": 2,
          "malwr_count": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
              {
                "key": 1,
                "key_as_string": "true",
                "doc_count": 2
              }
            ]
          }
        },
        {
          "key": 8,
          "doc_count": 2,
          "malwr_count": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
              {
                "key": 1,
                "key_as_string": "true",
                "doc_count": 2
              }
            ]
          }
        },
        {
          "key": 7,
          "doc_count": 1,
          "malwr_count": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
              {
                "key": 1,
                "key_as_string": "true",
                "doc_count": 1
              }
            ]
          }
        }
      ]
    }
  }
}

let rtData = pcData.aggregations.idx.buckets.flatMap(doc => {
  let rt = {};
  rt.idx = doc.key;
  rt.malwr_count = doc.malwr_count.buckets[0].doc_count;
  return rt;
});
console.log('=======');
console.log(rtData);