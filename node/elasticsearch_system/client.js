var elasticsearch = require('elasticsearch');
require('dotenv').config();

var client = new elasticsearch.Client({
    host: [process.env.protocol + '://' + process.env.els_id + ':' + process.env.els_pw + '@' + process.env.els_ip + ':' + process.env.els_port]
});

module.exports = client;