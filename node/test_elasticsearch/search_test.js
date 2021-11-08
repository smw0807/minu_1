var elasticsearch = require('elasticsearch');
var conf = require('./conf');

var client = new elasticsearch.Client({
    host: ['http://' + conf.els_id + ':' + conf.els_pw + '@' + conf.els_ip + ':' + conf.els_port]
});

async function getUserTest () {
    await client.search({
        index: 'user',
        type: '_doc',
        body: {
            query: {
                bool:{
                    must: []
                }
            }
        }
    }).then(function (resp) {
        console.log('result!!');
        var result = resp.hits.hits;
        console.log(result);
    }, function (err) {
        console.log('error!!');
        console.log(err);
    });
};
getUserTest();