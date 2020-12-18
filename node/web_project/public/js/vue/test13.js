//전역등록
Vue.component('my-component', {
    template: '<div>사용자 정의 컴포넌트입니다!!!</div>'
});

var myCom = {message: 'hello'};
var message = 'hello';
Vue.component('my-com', {
    template: '<span>{{message}}</span>',
    data: function() {
        // return message;
        return myCom;
    }
})

var cnt = { counter : 0 };
Vue.component('simple-counter', {
    template: '<button v-on:click="counter += 1">{{ counter }}</button>',
    data: function () {
        // 데이터는 기술적으로 함수이므로 Vue는 따지지 않지만
        // 각 컴포넌트 인스턴스에 대해 같은 객체 참조를 반환합니다.
        /**
         * test13.ejs에 simple-counter가 3개인데 이렇게 하면 
         * 컴포넌트 인스턴스가 모두 같은 data 객체를 공유하므로 하나의 카운터를 증가시키면 
         * 모두 증가함
         */
        // return cnt; 
        return {
            counter : 0
        }// 이렇게 하면 각각 고유한 내부 상태가됨
    }
})

var child = {
    template: '<div>지역등록 컴포넌트...</div>'
};

var trTpl = {
    template: '<tr><td>tdtdtdtdtdtd1</td><td>tdtdtdtdtdtd2</td></tr>'
};
var tr_tpl = {
    template: '<tr><td>{{ td1 }}</td><td>{{ td2 }}</td></tr>',
    data: function () {
        return {
            td1: 'tdtdtdtd1',
            td2: 'tdtdtdtd2'
        }
    }
}

//루트 인스턴스 생성
var app1 = new Vue({
    el:'#app1',
    components: { //인스턴트 옵션
        'child-component': child,
        'tr-component': trTpl,
        'tr-com': tr_tpl
    }
});

// Props....
Vue.component('child', {
    //props 정의
    props: ['message', 'name'],
    //data와 마찬가지로 prop은 템플릿 내부에서 사용할 수 있으며, vm.message로 사용할 수 있다.
    template: '<span> {{ message }} 내 이름은 {{ name }}야!</span>'
})

Vue.component('case', {
    props: ['myMessage'],
    template: '<span>{{ myMessage }}</span>'
})

var app2 = new Vue({
    el:'#app2',
    data: {
        message: '안녕?'
    }
})