var app1 = new Vue({
    el: '#app1',
    data: {
        isActive: false,
        isActive2: false,
        isBtn : true,
        panelStyle : 'panel-default',
        test: 'bg-danger'
    },
    methods: {
        goActive: function () {
            this.isActive = true;
        },
        backActive: function () {
            this.isActive = false;
        },
        btn3 : function () {
            this.isActive2 = (this.isActive2 == true ? false : true);
            this.isBtn = (this.isBtn == true ? false : true);
        },
        btnColor: function (data) {
            this.panelStyle = 'panel-' + data;
            this.test = 'bg-' + data;
        }
    }
});

Vue.component('my-component', {
    template: '<p class="foo bar">Hi</p>'
});

var app2 = new Vue({
    el: '#app2',
    data: {
        activeColor: 'red',
        fontSize: 30,
        styleObject: {
            'background-color': 'rgba(0,255,0,0.5)',
            fontSize: '20px'
        }
    }
});