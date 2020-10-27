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
