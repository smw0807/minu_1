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