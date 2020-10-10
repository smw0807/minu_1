module.exports = function (app) {
    const fs = require('fs');
    const folderPath = 'javascript/';
    app.get('/js-datatables', function (req, res) {
        var sess = req.session;
        console.log("datatables....");
        res.render(folderPath + 'datatables', {
            title: "JS API DataTables",
            lenght: 5,
            name: sess.name,
            username: sess.username
        });
    });
}