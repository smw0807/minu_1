/**
 * 디렉티브
 */

 var app1 = new Vue({
     el:"#app1",
     data:{
         url:'https://www.naver.com/'
     },
     methods: {
         doSomething: function () {
             console.log("doSomething!!");
         }
     }
 });

var app2 = new Vue({
    el:'#app2',
    data:{
        url:'/'
    },
    methods: {
        doSomething: function () {
            console.log("doSomething!! url change!!!!!");
            this.url = '/js-datatables';
        }
    }
});

var app3 = new Vue({
    el:'#app3',
    data: {
        id: '',
        pass: ''
    },
    methods: {
        sendText: function () {
            var id = $('#id').val();
            var pass = $('#pass').val();
            if (id == '') {
                alert("ID를 입력해주세요.");
                return;
            }
            if (pass == '') {
                alert("PW를 입력해주세요.");
                return;
            }
            this.id = id;
            this.pass = pass;
        },
        reset: function () {
            $('#id').val('');
            $('#pass').val('');
            this.id = '';
            this.pass = '';
        }
    }
});
