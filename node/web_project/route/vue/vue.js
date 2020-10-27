module.exports = function (app) {
    const pageType = 'vue';
    app.get('/vue-test1', function (req, res) {
        var sess = req.session;
        res.render('vue/test1', {
            title: "vue test1 page",
            length: 5,
            name: sess.name,
            username: sess.username,
            pageType: pageType
        })
    });
    app.get('/vue-test2', function (req, res) {
        var sess = req.session;
        res.render('vue/test2', {
            title: "vue test2 page",
            length: 5,
            name: sess.name,
            username: sess.username,
            pageType: pageType
        })
    });
    app.get('/vue-test3', function (req, res) {
        var sess = req.session;
        res.render('vue/test3', {
            title: "vue test3 page",
            length: 5,
            name: sess.name,
            username: sess.username,
            pageType: pageType
        })
    });
    app.get('/vue-test4', function (req, res) {
        var sess = req.session;
        res.render('vue/test4', {
            title: "vue test4 page",
            length: 5,
            name: sess.name,
            username: sess.username,
            pageType: pageType
        })
    });
    app.get('/vue-test5', function (req, res) {
        var sess = req.session;
        res.render('vue/test5', {
            title: "vue test5 page",
            length: 5,
            name: sess.name,
            username: sess.username,
            pageType: pageType,

        })
    });
    app.get('/vue-test6', function (req, res) {
        var sess = req.session;
        res.render('vue/test6', {
            title: "Vue 디렉티브",
            length: 5,
            name: sess.name,
            username: sess.username,
            pageType: pageType,

        })
    });
};