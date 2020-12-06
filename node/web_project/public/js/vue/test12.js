var app1 = new Vue({
    el:'#app1',
    data: {
        message: '',
        message2: '',
        checked: false,
        checkedNames: [],
        picked: ''
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