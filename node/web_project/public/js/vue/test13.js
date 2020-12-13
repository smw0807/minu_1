//전역등록
Vue.component('my-component', {
    template: '<div>사용자 정의 컴포넌트입니다!!!</div>'
});

var child = {
    template: '<div>지역등록 컴포넌트...</div>'
};
//루트 인스턴스 생성
var app1 = new Vue({
    el:'#app1',
    components: {
        'child-component': child
    }
});

