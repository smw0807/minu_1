const elasticsearch = require('elasticsearch');
const rl = require('readline');
const conf = require('./conf');
const data = require('./field_data/index_fields');

//npm install elasticsearch
const client = new elasticsearch.Client({
  hosts: [conf.els_proto + "://" + conf.els_id + ":" + conf.els_pw + "@" + conf.els_ip + ":" + conf.els_port]
});

const r = rl.createInterface({
  input: process.stdin,
  output: process.stdout
});

r.question("Input function : ", async (answer) => {
  try {
    var input = answer.split(" ");
    if (input == 'all') {
      var data_key = Object.keys(data);
      for (let item of data_key) {
        let rs = await addFields(data[item]);
        console.log(`${item.index} add Field result : `, rs);
      }
    } else {
      let rs = await addFields(data[input]);
      console.log(`${data[input].index} add Field result : `, rs);
    }
  } catch (err) {
    console.error(err);
  }
  r.close();
});

async function addFields (data) {
  let result = null;
  try {
    const idx = data.index;
    const props = data.properties;
    const rs = await client.indices.putMapping({
      index: idx,
      type: '_doc',
      include_type_name: true,
      body: {
        properties: props
      }
    })
    result = rs;
  } catch (err) {
    console.dir( err, {depth: 7});
    result = false;
  }
  return result;
};
/**
 * include_type_name: true 옵션 추가!!!
 * Types cannot be provided in put mapping requests, unless the include_type_name parameter is set to true.
 * {
  "error": {
    "root_cause": [
      {
        "type": "illegal_argument_exception",
        "reason": "Types cannot be provided in put mapping requests, unless the include_type_name parameter is set to true."
      }
    ],
    "type": "illegal_argument_exception",
    "reason": "Types cannot be provided in put mapping requests, unless the include_type_name parameter is set to true."
  },
  "status": 400
}

[mapper_parsing_exception] No type specified for field [ADD_OBJECT]

object 형식 6.8에선 되던건데 7.x는 안되는 이유를 모르겠네 가이드에는 되는 것 처럼 나와있는데..
https://esbook.kimjmin.net/07-settings-and-mappings/7.2-mappings/7.2.5-object-nested
{
    error: {
      root_cause: [
        {
          type: 'mapper_parsing_exception',
          reason: 'No type specified for field [ADD_OBJECT]'
        }
      ],
      type: 'mapper_parsing_exception',
      reason: 'Failed to parse mapping [_doc]: No type specified for field [ADD_OBJECT]',
      caused_by: {
        type: 'mapper_parsing_exception',
        reason: 'No type specified for field [ADD_OBJECT]'
      }
    },
    status: 400
  },
  statusCode: 400,
  response: '{"error":{"root_cause":[{"type":"mapper_parsing_exception","reason":"No type specified for field [ADD_OBJECT]"}],"type":"mapper_parsing_exception","reason":"Failed to parse mapping [_doc]: No type specified for field [ADD_OBJECT]","caused_by":{"type":"mapper_parsing_exception","reason":"No type specified for field [ADD_OBJECT]"}},"status":400}',
  toString: [Function (anonymous)],
  toJSON: [Function (anonymous)]
}
 */