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