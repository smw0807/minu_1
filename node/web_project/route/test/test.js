module.exports = function (app, util) {
    const pageType = 'test';
    app.get('/test1', function (req, res) {
        var sess = req.session;
        var date = util.dateFormat('yyyy-MM-dd');
        res.render('test/test', {
            title: "test page",
            length: 5,
            name: sess.name,
            username: sess.username,
            today: date,
            pageType: pageType
        })
    });

    app.get('/test2', function (req, res) {
        res.render('test/test2', {
            title: "test2 page",
            pageType: pageType
        });
    });

    app.get('/test3', function (req, res) {
        res.render('test/test3', {
            title: "test3 page",
            pageType: pageType
        });
    });

    app.get('/test4', function (req, res) {
        res.render('test/test4', {
            title: "test4 page",
            pageType: pageType
        });
    });
};