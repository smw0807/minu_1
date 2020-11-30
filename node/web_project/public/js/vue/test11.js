var app1 = new Vue({
    el: '#app1',
    data: {
        count: 0
    }
});

var app2 = new Vue({
    el: '#app2',
    data: {
        name: 'Vue.js'
    },
    //메소드는 methods 객체 안에 정의한다.
    methods: {
        great: function (event) {
            alert('Hello + ' + this.name + '!');
            //event는 네이티브 DOM 이벤트
            if (event) {
                console.log('event!!');
                console.log(event);
                alert(event.target.tagName);
            }
        }
    }
});
//javascript를 이용해서 메소드를 호출할 수 있다.
// app2.great();

var app3 = new Vue({
    el: '#app3',
    methods: {
        say: function (msg) {
            alert(msg);
        },
        warn: function(msg, event) {
            //네이티브 이벤트를 액세스 할 수 있음
            if (event) {
                event.preventDefault();
                alert(msg);
            }
        }
    }
});