module.exports = function (app) {
    app.get('/test', function (req, res) {
        console.log("test...");
        var sess = req.session;
        res.render('main/main', {
            title: "Main page",
            length: 5,
            name: sess.name,
            username: sess.username
        })
    });
};