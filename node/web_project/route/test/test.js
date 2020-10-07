module.exports = function (app, dt) {
    app.get('/test', function (req, res) {
        var sess = req.session;
        var date = dt.dateFormat('yyyy-MM-dd');
        res.render('test/test', {
            title: "test page",
            length: 5,
            name: sess.name,
            username: sess.username,
            today: date
        })
    });
};