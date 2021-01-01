const fs = require('fs');
const crypto = require('crypto');
const jsonPath = '/../../conf/user.json';
//사용자 ID 중복체크
function id_check (id) {
    return new Promise(function (rs, rj) {
        var result = true;
        fs.readFile(__dirname + jsonPath, 'utf-8', function(err, data) {
            var users = JSON.parse(data);
            if (users[id]) {
                result = false;
            }
            rs(result);
        });
    });
}

//사용자 PW SHA256 처리
function pw_sha256 (id, pw) {
    var hashPasswd = crypto.createHash('sha256').update(pw + id).digest('hex'); //salt 값으로 id 사용
    return hashPasswd;
}

//사용자 등록
function add_user (info) {
    return new Promise(function (rs, rj) {
        var result = false;
        fs.readFile(__dirname + jsonPath, "utf-8", function (err, data) {
            var users = JSON.parse(data);
            users[info.user_id] = info;
            fs.writeFile(__dirname + jsonPath, JSON.stringify(users, null, '\t'), "utf-8", function (err, data) {
                result = true;
                rs(result);
            });
        });
    });
}

module.exports = {
    'idCheck': id_check,
    'sha256': pw_sha256,
    'addUser': add_user
}