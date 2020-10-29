//https://kr.vuejs.org/v2/guide/computed.html

var app1 = new Vue({
    el:"#app1",
    data: {
        message: "안녕하세요"
    },
    computed: {
        reversedMessage: function () {
            return this.message.split('').reverse().join('');
        }
    },
});
