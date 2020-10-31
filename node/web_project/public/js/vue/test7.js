//https://kr.vuejs.org/v2/guide/computed.html

var app1 = new Vue({
    el:"#app1",
    data: {
        message: "안녕하세요"
    },
    methods: {
        reverseMsg: function () {
            console.log("렌더링 확인, methods");
            return this.message.split('').reverse().join('');
        }
    },
    computed: {
        reversedMessage: function () {
            console.log("렌더링 확인, computed");
            return this.message.split('').reverse().join('');
        }
    },
});
