const { get } = require("request");

module.exports = function (app, conf, fs, util) {
    const pageType = 'main';
    app.get('/', function (req, res) {
        var sess = req.session;
        res.render('index', {
            title: "Main page",
            length: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType
        })
    });

    app.get('/login/:userid/:userpw', function (req, res) {
        var sess;
        sess = req.session;
        var result = {};
        var date = util.dateFormat('yyyy-MM-dd HH:mm:ss');
        if (conf.db.is_db == 'N') {
            fs.readFile(__dirname + '/../conf/user.json', 'utf-8', function (err, data) {
                console.log('======== 로그인 시도 ========S');
                console.log(date);
                var users = JSON.parse(data);
                var userid = req.params.userid;
                var userpw = req.params.userpw;
                console.log('로그인 ID : ' + userid);
                if (!users[userid]) { //아이디 없을 때
                    console.log('결과 : Fail');
                    result["success"] = 0;
                    result["message"] = "아이디가 존재하지 않습니다.";
                    res.json(result);
                    console.log('======== 로그인 시도 ========E');
                    return;
                }
                if (users[userid]["pass"] == userpw) {
                    console.log('결과 : Success');
                    result["success"] = 1;
                    sess.userid = userid;
                    sess.username = users[userid]["user_nm"];
                    res.json(result);
                } else {
                    console.log('결과 : Fail');
                    result["success"] = 0;
                    result["message"] = "패스워드가 일치하지 않습니다.";
                    res.json(result);
                }
                console.log('======== 로그인 시도 ========E');
            });
        }
    });

    app.get('/logout', function (req, res) {
        console.log('login!!');
        sess = req.session;
        if (sess.username) {
            req.session.destroy(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });
};