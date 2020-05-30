$(document).ready(function ()  {
    $('#btn_login').on('click', function (e) {
        console.log("???");
        var username = $('#user_id').val();
        var password = $('#user_pw').val();
        console.log(username);
        console.log(password);
        if (username == '') {
            alert("아이디를 입력해주세요.");
            return;
        }
        if (password == '') {
            alert("패스워드를 입력해주세요.");
            return;
        }
        var request = $.ajax({
            url:'/login/' + username + '/' + password,
            dataType: 'json',
            type: 'get'
        }).done(function (s) {
            console.log(s);
            var rs = s.success;
            console.log(rs);
            if (rs == 0) {
                $('user_id').val('');
                $('user_pw').val('');
                alert("로그인에 실패했습니다.");
                return;
            }
            if (rs == 1) {
                alert("로그인 성공");
                location.href = '/';
            }
        });
    });


    $('#btn_logout').click(function (e) {
        console.log("logout!!!");
        $.ajax({
            url:'/logout',
            dataType:'json',
            type:'get'
        }).done(function (s) {
            console.log(s);
            location.href = '/';
        })
    });
});
