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