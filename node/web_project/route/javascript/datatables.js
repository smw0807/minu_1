module.exports = function (app) {
    const folderPath = 'javascript/';
    const pageType = "js";
    app.get('/js-datatables', function (req, res) {
        var sess = req.session;
        console.log("datatables....");
        res.render(folderPath + 'datatables', {
            title: "JS API DataTables",
            lenght: 5,
            name: sess.name,
            username: sess.username,
            pageType: pageType
        });
    });
}