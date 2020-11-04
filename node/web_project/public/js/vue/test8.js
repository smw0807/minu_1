var app1 = new Vue({
    el: '#app1',
    data: {
        isActive: false,
        isActive2: false,
        isBtn : true
        
    },
    methods: {
        goActive: function () {
            console.log("goActive");
            this.isActive = true;
        },
        backActive: function () {
            console.log("backActive");
            this.isActive = false;
        }
    }
});