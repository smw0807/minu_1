var elasticsearch = require("elasticsearch");
var rl = require("readline");
var fs = require("fs");

var conf = require("./conf");

//npm install elasticsearch
var client = new elasticsearch.Client({
  hosts: [
    "https://" +
      conf.els_id +
      ":" +
      conf.els_pw +
      "@" +
      conf.els_ip +
      ":" +
      conf.els_port,
  ],
});

var r = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

r.question("Input File Name : ", function (answer) {
  var input = answer.split(" ");
  var data = fs.readFileSync("./bulk_data/" + input, "utf8");

  var bulkarr = [];
  bulkarr.push(data);

  await addDocument(bulkarr);
  r.close();
});

async function addDocument (d) {
	try {
		const rs = await client.bulk({
			body:d
		})
		console.log(rs);
	} catch (err) {
		console.error('addDocument Error : ', err);
	}
};
