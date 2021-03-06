module.exports = function (app) {
    const pageType = 'vue';
    app.get('/vue-test1', function (req, res) {
        var sess = req.session;
        res.render('vue/test1', {
            title: "vue test1 page",
            length: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType
        })
    });
    app.get('/vue-test2', function (req, res) {
        var sess = req.session;
        res.render('vue/test2', {
            title: "vue test2 page",
            length: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType
        })
    });
    app.get('/vue-test3', function (req, res) {
        var sess = req.session;
        res.render('vue/test3', {
            title: "vue test3 page",
            length: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType
        })
    });
    app.get('/vue-test4', function (req, res) {
        var sess = req.session;
        res.render('vue/test4', {
            title: "vue test4 page",
            length: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType
        })
    });
    app.get('/vue-test5', function (req, res) {
        var sess = req.session;
        res.render('vue/test5', {
            title: "vue test5 page",
            length: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType,

        })
    });
    app.get('/vue-test6', function (req, res) {
        var sess = req.session;
        res.render('vue/test6', {
            title: "Vue 디렉티브",
            length: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType,

        })
    });
    app.get('/vue-test7', function (req, res) {
        var sess = req.session;
        res.render('vue/test7', {
            title: "Vue computed와 watch",
            length: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType,

        })
    });
    app.get('/vue-test8', function (req, res) {
        var sess = req.session;
        res.render('vue/test8', {
            title: "Vue 클래스와 스타일 바인딩",
            length: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType,

        })
    });
    app.get('/vue-test9', function (req, res) {
        var sess = req.session;
        res.render('vue/test9', {
            title: "Vue 조건부 렌더링",
            length: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType,

        })
    });
    app.get('/vue-test10', function (req, res) {
        var sess = req.session;
        res.render('vue/test10', {
            title: "Vue 리스트 렌더링",
            length: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType,

        })
    });
    app.get('/vue-test11', function (req, res) {
        var sess = req.session;
        res.render('vue/test11', {
            title: "Vue 이벤트 핸들링",
            length: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType,

        })
    });
    app.get('/vue-test12', function (req, res) {
        var sess = req.session;
        res.render('vue/test12', {
            title: "Vue 폼 입력 바인딩",
            length: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType,
        })
    });
    app.get('/vue-test13', function (req, res) {
        var sess = req.session;
        res.render('vue/test13', {
            title: "Vue 컴포넌트",
            length: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType,
        })
    });
};