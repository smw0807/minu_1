//https://kr.vuejs.org/v2/guide/syntax.html
var app = new Vue({
    el: '#app',
    data: {
        title: 'v-once '
    },
    methods: {
        sayHello: function() {
            this.title = "hello!!!";
            return this.title;
        }
    }
});

var app2 = new Vue({
    el: '#app2',
    data: {
        htmlTag: '<a href="/" class="btn btn-info" target="_blank">GO!!</a>'
    }
});