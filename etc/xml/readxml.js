const parser = require("xml2json");
const fs = require("fs");

fs.readFile('./test.xml', 'utf-8', function (err, data) {
    var json = parser.toJson(data);
    console.log(json);
})