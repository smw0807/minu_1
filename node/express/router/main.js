module.exports = function (app, fs) {
    app.get('/', function (req, res) {
        res.render('index', {
            title: "Index Page",
            length: 5
        });
    });
    app.get('/about', function (req, res) {
        res.render('about.html');
    });

    app.get('/list', function (req, res) {
        fs.readFile(__dirname + '/../data/user.json', 'utf-8', function(err, data) {
           console.log(data);
           res.end(data); 
        });
    });

    app.get('/getUser/:username', function (req, res) {
        fs.readFile(__dirname + '/../data/user.json', 'utf-8', function (err, data) {
            var users = JSON.parse(data);
            console.log(users);
            var getUser = users[req.params.username];
            console.log(getUser);
            res.json(getUser);
        });
    });

    app.post('/addUser/:username', function (req, res) {
        var result = {};
        var username = req.params.username;

        if (!req.body["password"] || !req.body["name"]) {
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        fs.readFile(__dirname + "/../data/user.json", "utf-8", function (err, data) {
            var users = JSON.parse(data);
            if (users[username]) {
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            users[username] = req.body;

            fs.writeFile(__dirname + '/../data/user.json', JSON.stringify(users, null, '\t'), "utf-8", function (err, data) {
                result = {"success" : 1};
                res.json(result);
            });
        });
    });
}