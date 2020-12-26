const { get } = require("request");

module.exports = function (app, conf, fs) {
    const pageType = 'main';
    app.get('/', function (req, res) {
        var sess = req.session;
        // sess.username = 'smw0807';
        // console.log('/');
        // console.log(sess.username);
        if (typeof sess.username == 'undefined') {
            res.render('login', {
                title: "Login",
                pageType: pageType
            })
        } else {
            res.render('index', {
                title: "Main page",
                length: 5,
                userid: sess.userid,
                username: sess.username,
                pageType: pageType
            })
        }
    });

    app.get('/login/:userid/:userpw', function (req, res) {
        console.log('user login!!');
        var sess;
        sess = req.session;
        var result = {};
        if (conf.db.is_db == 'N') {
            fs.readFile(__dirname + '/../conf/user.json', 'utf-8', function (err, data) {
                var users = JSON.parse(data);
                var userid = req.params.userid;
                var userpw = req.params.userpw;
                if (!users[userid]) { //아이디 없을 때
                    console.log("userid not found");
                    result["success"] = 0;
                    result["message"] = "아이디가 존재하지 않습니다.";
                    res.json(result);
                    return;
                }
                if (users[userid]["pass"] == userpw) {
                    console.log("login success!");
                    result["success"] = 1;
                    sess.userid = userid;
                    sess.username = users[userid]["user_nm"];
                    res.json(result);
                } else {
                    console.log("fail login..");
                    result["success"] = 0;
                    result["message"] = "패스워드가 일치하지 않습니다.";
                    res.json(result);
                }
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