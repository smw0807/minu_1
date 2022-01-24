exports.add_1 = {
  index: 'test_idx',
  properties: {
    "ADD_FIELD1": {
        "type":"keyword"
    },
    "ADD_FIELD2": {
        "type": "keyword"
    },
    "ADD_OBJECT": {
      "properteis":{
        "OBJ_1": {
          "type":"keyword"
        },
        "OBJ_2": {
          "type": "integer"
        }
      }
    }
  }
};

exports.add_2 =  {
  index: 'user_idx',
  properties: {
    "ADD_FIELD1": {
      "type":"keyword"
    }
  }
}