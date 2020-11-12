var app1 = new Vue({
    el: '#app1',
    data:{
        awesome: true,
        tpl_1: false,
        velseif: '',
        check: '' //v-model을 이용해서 값이 바로 여기로 들어옴?
    },
    methods: {
        awesomeBtn: function () {
            this.awesome = this.awesome == true ? false : true;
        },
        templateBtn: function () {
            this.tpl_1 = this.tpl_1 == true ? false : true;
        }
    }
});