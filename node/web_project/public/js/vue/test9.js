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

var app2 = new Vue({
    el: '#app2',
    data:{
        loginType: 'username'
    },
    methods: {
        changeLoginType: function() {
            console.log('changeLoginType');
            var type = this.loginType;
            if (type == 'username') {
                this.loginType = 'email';
            } else {
                this.loginType = 'username';
            }
        },
        getData: function() {
            console.log('getData');
            var name = $('#user_name').val();
            var email = $('#user_email').val();
            console.log(name);
            console.log(email);
        }
    }
});

var app3 = new Vue({
    el:"#app3",
    data: {
        showTest : false
    },
    methods: {
        showChange: function () {
            console.log('showChange');
            this.showTest = (this.showTest == true ? false : true);
            console.log(this.showTest);
        }
    }
});