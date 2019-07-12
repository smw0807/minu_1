var req = require("request");
var rd = require("../make_random_data/random");
let auth_id = "test123";
let auth_pass = "test12345";

let msgCnt = 500;
let sendMs = 5000;

var data = require("../make_random_data/run");
var option = {
    url: data.url,
    method: "POST",
    headers: {
        'Authorization': Buffer.from(auth_id + ":" + auth_pass, "utf8").toString('base64'),
        'API-Version': "1.2"
      }
};

const sleep = function (ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};
//? Promise?

const send_loop = async () => {
    while (true) {
        console.time("send");
        var msg_list = rd.make_data(msgCnt);

        req(option, function (err, res, body) {
            console.info(body);
            console.timeEnd("send");
        });
        await sleep(sendMs);
    }
};
send_loop();
//? async-await?