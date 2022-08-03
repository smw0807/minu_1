function changeIp (ip, type) {
  var rt = '';
  var ipArr = ip.split(".");
  
  for (var i=0; i<ipArr.length; i++) {
    if (type) {
      var v = parseInt(ipArr[i]).toString(2);
      for (var j=0; j<(8-v.length); j++) {
        rt = rt + "0";
      }
      rt = rt + v;
    } else {
      var v = parseInt(ipArr[i], 2);
      rt = rt + v;
      if (i < 3) {
        rt = rt + ".";
      }
    }
  }

  return rt;
}

function classIpToRange (class_ip) {
  var rtVal = {s_ip: '', e_ip: ''};
  var ip = changeIp(class_ip.split("/")[0], 1);
  var classNum = class_ip.split("/")[1];
  var classZero = 32 - classNum;
  var s_ip = ip.substring(0, classNum);
  var e_ip = ip.substring(0, classNum);

  for (var i=classZero; i>0; i--) {
    if (i == 1) {
      s_ip = s_ip + "1";
      e_ip = e_ip + "0";
    } else {
      s_ip = s_ip + "0";
      e_ip = e_ip + "1";
    }
  }

  s_ip = s_ip.substr(0, 8) + "." + s_ip.substr(8, 8) + "." + s_ip.substr(16, 8) + "." + s_ip.substr(24);
  e_ip = e_ip.substr(0, 8) + "." + e_ip.substr(8, 8) + "." + e_ip.substr(16, 8) + "." + e_ip.substr(24);
  rtVal.s_ip = changeIp(s_ip, 0);
  rtVal.e_ip = changeIp(e_ip, 0);

  return rtVal;
}

module.exports = {
  classIpToRange
}