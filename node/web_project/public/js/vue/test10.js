var arr = ["apple","oragne","grapes","strawberry","watermelon"]

var app1 = new Vue({
    el: '#app1',
    data: {
        parentMessage: 'Parent',
        items: [
            { message : 'foo' },
            { message : 'bar' },
        ]
    }
});

var app2 = new Vue({
   el: '#app2',
   data: {
       object: {
           title: 'How to do lists in Vue',
           author: 'Song Min Woo',
           publishedAt: '2020-11-17',
           NowStatus: 'sad'
       }
   } 
});

var app3 = new Vue({
    el: '#app3',
    data: {
        items: arr
    },
    created: function() {
        this.items = arr.filter(function (val, idx, arr) {
            return val.length > 5;
        });
    },
});

var app4 = new Vue({
    el:'#app4',
    data: {
        items: [
            'a', 'b', 'c', 'd'
        ]
    },
    created: function () {
        // if (this.items.length > 5) {
        //     this.items.length = 2;
        // }
        // this.items[2] = 'ccccc';
    }
});
// app4.items[1] = 'bb';
// Vue.set(app4.items, 1, 'bb');
// app4.$set(app4.items, 1, 'bbbb');
// app4.items.splice(1, 1, 'bbb');
// app4.items.length = 3;
// app4.items.splice(3);

var app5 = new Vue({
    el:'#app5',
    data: {
        userProfile: {
            name: 'minwoo'
        }
    }
});
app5.$set(app5.userProfile, "now", "study");
Vue.set(app5.userProfile, "age", "29");
Object.assign(app5.userProfile, {
    test1: 'test1',
    test2: 'test2'
});
app5.userProfile.iiii = 'TTTT'; //이건 안된다는거 아니었나? 되는데....
app5.userProfile = Object.assign({}, app5.userProfile, {
    test11: 'test11',
    test22: 'test22',
    test33: 'test33'
})

var app6 = new Vue({
    el: '#app6',
    data: {
        numbers: [1,4,2,6,5,3]
    },
    computed: {
        evenNumbers: function () {
            return this.numbers.filter(function (number) {
                return number % 2 === 0;
            })
        }
    },
    methods: {
        even: function(num) {
            return num.filter(function (number) {
                return number % 2 === 0;
            })
        }
    }
});