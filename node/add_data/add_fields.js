var elasticsearch = require('elasticsearch');
var rl = require('readline');

var conf = require('./conf');

var data = require('./field_data/index_fields');
var info;

//npm install elasticsearch
var client = new elasticsearch.Client({
    hosts: ["https://" + conf.els_id + ":" + conf.els_pw + "@" + conf.els_ip + ":" + conf.els_port]
});

var r = rl.createInterface({
    input: process.stdin,
    output: process.stdout
});

r.question("Input function : ", async function (answer) {
    var input = answer.split(" ");
    if (input == 'all') {
        var data_key = Object.keys(data);
        for (var i in data_key) {
            info = data[data_key[i]]();
            let run = await getFieldsInfo(info);
        }
    } else {
        info = data[input]();
        let run = await getFieldsInfo(info);
    }
    r.close();
});

async function getFieldsInfo(data) {
    var index = data.index;
    var prop = data.properties;
    console.log("Info....................................");
    console.log("index : " + index);
    console.log("properties : " + prop);
    let run = await addFields(index, prop);
};

let addFields = function (idx, info) {
    return new Promise(function (resolve, reject) {
        client.indices.putMapping({
            index: idx,
            type: 'doc',
            body: {
                properties: info
            }
        }, function(err, resp, status) {
            if (err) {
                console.log("err!!!");
                console.log(err);
                console.log("End---------------------");
                reject(err)
            } else {
                console.log(resp);
                console.log("End---------------------");
                resolve(resp);
            }
        });
    });
};