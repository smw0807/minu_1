module.exports = function (app, dt) {
    app.get('/test1', function (req, res) {
        const pageType = 'test';
        var sess = req.session;
        var date = dt.dateFormat('yyyy-MM-dd');
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
};