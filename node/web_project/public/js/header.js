var header = new Vue({
    el: '#header',
    data: {
        user_id: '',
        user_pw: '',
        user_nm: ''
    },
    methods: {
        showLoginForm: function () {
            $('#myModal').modal({
                backdrop: true
            });
        },
        login: function () {
            console.log("login!!!!!!!!");
            var user_id = this.user_id;
            var user_pw = this.user_pw;
            if (user_id == '') {
                alert("아이디를 입력해주세요.");
                return;
            }
            if (user_pw == '') {
                alert("패스워드를 입력해주세요.");
                return;
           }
           $.ajax({
               url: '/login/' + user_id + '/' + user_pw,
               dataType: 'json',
               type: 'get'
           }).done(function (rs) {
                console.log(rs);
                if (rs.success == 0) {
                    this.user_id = '';
                    this.user_pw = '';
                    alert(rs.message);
                } else {
                    $('#myModal').modal('hide');
                    location.href = '/';
                }
           }).fail(function (err) {
                console.log("실패")
                console.log(err);
           })
        },
        join: function () {
            var test = true;
            if (test) {
                alert('아직 미완성');
                return;
            }
            
        }
    }
})