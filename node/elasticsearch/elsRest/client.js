var elasticsearch = require('elasticsearch');
var conf = require('../conf/conf');

var client = new elasticsearch.Client({
    host: ['http://' + conf.els_id + ':' + conf.els_pw + '@' + conf.els_ip + ':' + conf.els_port]
});

module.exports = client;