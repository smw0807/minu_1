const elasticsearch = require('elasticsearch');

const url = 'https://test:test@192.168.1.23:9200';

const es_client = new elasticsearch.Client({hosts: url});

// es_client.search({index: 'ts_cmn_code'}, function(err, rs) {
//   if(err){
//     console.log('err :', err);
//   } else {
//     console.log(rs);
//   }
// });

module.exports = es_client;