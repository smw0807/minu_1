exports.index_field_1 = function () {
    return {
        index: 'ts_accident_template',
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
    }
};

exports.index_field_2 = function () {
    return {
        index: 'ts_institution_assets',
        properties: {
            "ADD_FIELD1": {
                "type":"keyword"
            }
        }
    }
}