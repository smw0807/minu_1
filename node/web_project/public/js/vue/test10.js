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
app4.$set(app4.items, 1, 'bbbb');
// app4.items.splice(1, 1, 'bbb');
// app4.items.length = 3;
// app4.items.splice(3);
