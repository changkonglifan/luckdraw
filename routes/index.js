var express = require('express');
var fs = require('fs')
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/data', function (req, res, next) {
    var data = fs.readFileSync('./data/data.json','utf-8');
    res.send(data);
    res.end();
});
module.exports = router;
