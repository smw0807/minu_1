module.exports = function (app) {
    const folderPath = 'javascript/';
    const pageType = "js";
    app.get('/js-datatables', function (req, res) {
        var sess = req.session;
        res.render(folderPath + 'datatables', {
            title: "JS API DataTables",
            lenght: 5,
            userid: sess.userid,
            username: sess.username,
            pageType: pageType
        });
    });
}