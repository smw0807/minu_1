var test = {
    one: function(e) {
        return {
            data: e,
            getData: () => {
                console.log("??");
                console.log(e); //xyz
                console.log(this.tt); // abc
                return e;
            }
        }
    },
    tt: "abc"
}
var aa = test.one("xyz");
console.log(aa.getData());

console.log("----------------------------------");

var test2 = {
    one: function(e) {
        return {
            data: e,
            getData: function() {
                console.log("??");
                console.log(e); //xyz
                console.log(this.tt); // undefined
                return e;
            }
        }
    },
    tt: "abc"
}
var aaa = test2.one("xyz");
console.log(aaa.getData());
