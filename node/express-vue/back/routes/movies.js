var express = require('express');
var router = express.Router();
var movies = require('../json/movies.json');

router.get('/', function (req, res, next) {
    res.send(movies);
});

router.get('/:id', function (req, res, next) {
    console.log('input id!!!');
    // String으로 하는 방법
    // var id = req.params.id;
    // var mv = movies[id];

    // Integer로 하는 방법....(인터넷에 있는 방식)
    var id = parseInt(req.params.id);
    var mv = movies.filter(function (movies) {
        return movies.id == id;
    });
    res.send(mv);
});


module.exports = router;