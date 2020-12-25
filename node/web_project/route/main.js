module.exports = function (app, date) {
    const pageType = 'main';
    app.get('/', function (req, res) {
        var sess = req.session;
        sess.username = 'smw0807';
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
                name: sess.name,
                username: sess.username,
                pageType: pageType
            })
        }
    });
};