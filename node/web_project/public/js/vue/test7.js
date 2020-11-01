//https://kr.vuejs.org/v2/guide/computed.html

var app1 = new Vue({
    el:"#app1",
    data: {
        message: "안녕하세요"
    },
    methods: {
        reverseMsg: function () {
            // console.log("렌더링 확인, methods");
            return this.message.split('').reverse().join('');
        }
    },
    computed: {
        reversedMessage: function () {
            // console.log("렌더링 확인, computed");
            return this.message.split('').reverse().join('');
        }
    },
});

var app2 = new Vue({
    el:'#app2',
    data: {
        firstName: 'Foo',
        lastName: 'Bar',
        fullName: 'Foo Bar'
    },
    watch: {
        firstName: function (val) {
            console.log('watch firstName');
            console.log(val);
            this.fullName = val + ' ' + this.lastName
        },
        lastName: function (val) {
            console.log('watch lastName');
            console.log(val);
            this.fullName = this.firstName + ' ' + val
        }
    }
});//위의 코드는 명령형이고 또 코드를 반복한다.

var app3 = new Vue({
    el:'#app3',
    data: {
        firstName: 'Foo',
        lastName: 'Bar',
        fullName: 'Foo Bar'
    },
    computed: {
        fullNmae: function () {
            console.log('computed fullName');
            return this.firstName + ' ' + this.lastName
        }
    }
});// 아직은 이걸로 watch와 computed의 차이를 모르겠다.

var app4 = new Vue({
    el:'#app4',
    data: {
        firstName: 'Foo',
        lastName: 'Bar',
        fullName: 'Foo Bar'
    },
    computed: {
        fullNmae: {
            //getter
            get: function () {
                return this.firstName + ' ' + this.lastName
            },
            //setter
            set: function (val) {
                var names = val.split(' ');
                this.firstName = names[0];
                this.lastName = names[names.length - 1];
            }
        }
    }
});

var app5 = new Vue({
    el:'#app5',
    data: {
        question: '',
        answer: '질문을 하기 전까지는 대답할 수 없습니다.'
    },
    watch: {
        //질문이 변경될 때 마다 이 기능이 실행됩니다.
        question: function (val) {
            console.log("question : " + val);
            this.answer = "입력을 기다리는 중 ...";
            this.debouncedGetAnswer();
        }
    },
    created: function () { //처음 렌더링 될 때 여기 타서 watch 안에 있는 this.debouncedGetAnswer셋팅 해주나봄
        console.log("created");
        // _.debounce는 lodash가 제공하는 기능으로
        // 특히 시간이 많이 소요되는 작업을 실행할 수 있는 빈도를 제한합니다.
        // 이 경우, 우리는 yesno.wtf/api 에 액세스 하는 빈도를 제한하고,
        // 사용자가 ajax요청을 하기 전에 타이핑을 완전히 마칠 때까지 기다리길 바랍니다.
        // _.debounce 함수(또는 이와 유사한 _.throttle)에 대한
        // 자세한 내용을 보려면 https://lodash.com/docs#debounce 를 방문하세요.
        this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
    },
    methods: {
        getAnswer: function () {
            console.log('methods');
            if (this.question.indexOf('?') == -1) {
                this.answer = '질문에는 일반적으로 물음표가포함 됩니다. ;-';
                return;
            }
            this.answer = '생각중...';
            var vm = this;
            axios.get('https://yesno.wtf/api').then(function (rs) {
                console.log('success');
                console.log(rs);
                vm.answer = _.capitalize(rs.data.answer);
            })
            .catch(function (err) {
                console.log('error');
                console.log(err);
                vm.answer = '에러!! API요청에 오류가 있습니다. ' + err
            });
        }
    }
});