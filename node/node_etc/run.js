var rd = require("./random");

var run = function () {
    var data = rd.make_data(100);
    console.log("result!!!!");
    console.log(data);
}

setInterval(function() {
    run();
}, 5000);