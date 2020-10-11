module.exports = function (app) {
    const pageType = 'vue';
    app.get('/vue-test1', function (req, res) {
        var sess = req.session;
        console.log("vue test1...");
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
        console.log("vue test2...");
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
        console.log("vue test3...");
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
        console.log("vue test4...");
        res.render('vue/test4', {
            title: "vue test4 page",
            length: 5,
            name: sess.name,
            username: sess.username,
            pageType: pageType
        })
    });
    
};