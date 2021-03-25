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
  
  
  if(r > (list.length-1)) {
    console.info(r);
    r = (list.length -1);
    console.info(r +" ++ "+ list.length);
    console.info("@@@@@@@@@@@@@@@@@@@");
  }

  //console.info(r);
try{
  let value = list[r].split(",");
  for(var i=0;i<value.length;i++){
    msg[col_code[i]] = value[i];  
  }
}catch(e) {
  console.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@22###############3");
  console.info(r);
  process.exit();
}
  
}

var list = function(list) {
  let r = intRange(0, list.length - 1);
  return list[r];
}

module.exports = {
  "intRange": intRange,
  "ipRange": ipRange,
  "listColArray": listColArray,
  "list":list
}
