var func = {
    test1: function (a) {
        console.log(a);
        return "aa";
    }
};

var func2 = function (a) {
    console.log(a);
    var test = {
        test1: function (b) {
            console.log(b);
            return "test1";
        },
        test2: (c) => {
            console.log(c);
            return "test2";
        }
    }
    console.log(test.test2(a));
    return test.test2(a);
}
// console.log(func.test1("aa"));
// console.log(func2.test.test1("aa")); //안돼


console.log(func2("aa"));
