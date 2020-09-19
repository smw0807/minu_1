module.exports = function (app) {
    app.get('/', function (req, res) {
        var sess = req.session;
        console.log("index...");
        res.render('index', {
            title: "Main page",
            length: 5,
            name: sess.name,
            username: sess.username
        })
    });
};