var app1 = new Vue({
    el:'#app1',
    data: {
        message: '',
        message2: '',
        checked: false,
        checkedNames: [],
        picked: '',
        selected: '1',
        selected2: [],
        forSelected: 'value3',
        options: [
            { value: 'value1', text: 'text1' },
            { value: 'value2', text: 'text2' },
            { value: 'value3', text: 'text3' },
            { value: 'value4', text: 'text4' },
            { value: 'value5', text: 'text5' }
        ]
    },
    created: function(){
      
    },
    watch: {
        message: function (d) {
        },
        checked: function (b) {
        },
        checkedNames: function (d) {
        }
    },
    methods: {
        submit: function () {
            console.log("submit!!");
            var msg1 = this.message;
            var msg2 = this.message2;
            var chk = this.checked;
            var member = this.checkedNames;
            var pick = this.picked;
            if (msg1 == '') {
                alert("문자열을 입력해주세요.");
                return;
            }
            if (msg2 == '') {
                alert('여러줄을 가진 문장을 입력해주세요.');
                return;
            }
            if (member.length == 0) {
                alert("멤버를 최소 1명이라도 선택해야합니다.");
                return;
            }
            if (pick == '') {
                alert("라디오 버튼 중 하나라도 선택되어야 합니다.");
                return;
            }
            console.log("success!!");
            alert("success!");
        }
    }
    
});

var app2 = new Vue({
    el: '#app2',
    data: {
        toggle: '',
        radio: '',
        selected: ''
    },
    watch: {
        selected: function (e) {
            console.log("selected");
            console.log(e);
        }
    }
});

var app3 = new Vue({
    el:'#app3',
    data: {
        msg: '',
        age1: '',
        age2: '',
        trimMsg:'asdasd asdasd asdasd'
    },
    watch: {
        msg: function (e) {
            console.log(e);
        }
    },
    methods: {
        show: function () {
            console.log("show data type!!");
            console.log(this.age1);
            console.log(typeof this.age1);
            console.log(this.age2);
            console.log(typeof this.age2);
        },
        trim: function (e) {
            console.log("msg trim...");
            console.log(this.trimMsg);
        }
    }
});