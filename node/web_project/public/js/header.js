var header = new Vue({
    el: '#header',
    data: {
        user_id: '',
        user_pw: '',
        user_nm: '',

        join_user_id: '',
        join_user_nm: '',
        join_user_pw: '',
        join_user_pw_chk: '',

        join_user_id_error: '',
        join_user_nm_error: '',
        join_user_pw_error: '',
        join_user_pw_chk_error: '',

        input_error: {
            user_id: false,
            user_nm: false,
            user_pw: false,
            user_pw_chk: false
        },

        error_label_style: {
            'color': 'red',
            'font-size': '11px'
        }
    },
    methods: {
        showLoginForm: function () {
            $('#myModal').modal({
                backdrop: true
            });
        },
        login: function () {
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
        showJoinForm: function () {
            $('#myModal').modal('hide');
            $('#myModa2').modal({
                backdrop: true
            });
        },
        join: function () {
            //에러 문구 초기화
            this.join_user_id_error = '';
            this.join_user_nm_error = '';
            this.join_user_pw_error = '';
            this.join_user_pw_chk_error = '';

            //에러 표시 초기화
            this.input_error.user_id = false;
            this.input_error.user_nm = false;
            this.input_error.user_pw = false;
            this.input_error.user_pw_chk = false;

            //입력값 가져오기
            var join_user_id = this.join_user_id
            var join_user_nm = this.join_user_nm
            var join_user_pw = this.join_user_pw
            var join_user_pw_chk = this.join_user_pw_chk

            var setting = true;
            if (join_user_id == '') {
                this.join_user_id_error = '아이디를 입력해주시기 바랍니다.';
                this.input_error.user_id = true;
                setting = false;
            }
            if (join_user_nm == '') {
                this.join_user_nm_error = '이름을 입력해주시기 바랍니다.';
                this.input_error.user_nm = true;
                setting = false;
            }
            if (join_user_pw == '') {
                this.join_user_pw_error = '패스워드를 입력해주시기 바랍니다.';
                this.input_error.user_pw = true;
                setting = false;
            } else {
                if (join_user_pw != join_user_pw_chk) {
                    var msg = '패스워드가 서로 일치하지 않습니다.';
                    this.join_user_pw_error = msg;
                    this.join_user_pw_chk_error = msg;
                    this.input_error.user_pw = true;
                    this.input_error.user_pw_chk = true;
                    setting = false;
                }
            }
            if (join_user_pw_chk == '') {
                this.join_user_pw_chk_error = '패스워드 확인을 입력해주시기 바랍니다.';
                this.input_error.user_pw_chk = true;
                setting = false;
            } 

            if (setting) {
                var params = {
                    user_id: join_user_id,
                    user_nm: join_user_nm,
                    user_pw: join_user_pw
                }
                $.ajax({
                    url: '/joinUser',
                    type: 'POST',
                    dataType: 'json',
                    data: params,
                    success: function (rs) {
                        console.log("success!");
                        console.log(rs);
                        if (rs.success == 0) {
                            alert(rs.message);
                            $('#join_user_id').focus();
                            return;
                        } else {
                            alert(rs.message);
                            $('#myModa2').modal('hide');
                            return;
                        }
                    },
                    error: function (rs) {
                        console.log('error');
                        console.log(rs);
                    }
                })
            }
        }
    }
})