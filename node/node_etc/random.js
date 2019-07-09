var ut = require("./utils");

var make_data = function (cnt) {
    let rt_list = [];
    for (var i = 0; i < cnt; i++) {
        var data = {};
        data.name = "minu";
        data.ip = ut.ipRange("192.168.1.1", "192.168.1.255");
        data.number = ut.intRange(0, 10000);
        var appgrp = ut.appgrp();
        data.appgrp_code = appgrp.key;
        data.appgrp_name = appgrp.value;

        rt_list.push(data);
    }
    return {
        "make_count": cnt,
        "make_data": rt_list
    }
}

module.exports = {
    "make_data": make_data
}