var intRange = function(n1, n2) {
	return parseInt(Math.random() * (n2 - n1 + 1)) + n1;
};

var ipRange = function(sip, eip) {
  let rip = longToIp(intRange(ipToLong(sip), ipToLong(eip)));
  return rip;
};

var ipToLong = function (ip) {  
  return ip.split('.').reduce(function (ipInt, octet) {
    return (ipInt << 8) + parseInt(octet, 10);
  }, 0) >>> 0;
};

var longToIp = function(ip) {
  let result = "";

  result += (ip>>>24) +".";
  result += (ip>>16 & 255)+".";
  result += (ip>>8 & 255)+".";
  result += ip & 255;

  return result;
};

var listColArray = function(col, list, msg) {
  let col_code = col[0].split(",");  
  let r = intRange(0, list.length - 1);
  let value = list[r].split(",");
  for(var i=0;i<value.length;i++){
    msg[col_code[i]] = value[i];  
  }
}

var list = function(list) {
  let r = intRange(0, list.length - 1);
  return list[r];
}

var appgrp = function () {
  var appgrp = {
    0: "미분류",
    1: "원격",
    2: "웹",
    3: "P2P",
    4: "파일 전송",
    5: "메신저",
    6: "도메인",
    7: "게임",
    8: "메일",
    12: "스트리밍",
    14: "VoIP"
  }
  var keys = Object.keys(appgrp);
  var randomKey = keys[Math.floor(Math.random() * keys.length)];
  var randomValue = appgrp[randomKey];
  var result = {};
  result.key = parseInt(randomKey);
  result.value = randomValue;
  return result;
}

module.exports = {
  "intRange": intRange,
  "ipRange": ipRange,
  "listColArray": listColArray,
  "list":list,
  "appgrp": appgrp
}
