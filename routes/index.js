var express = require('express');
var fs = require('fs');
var util = require('../util')
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
/**
 * 获取总人数数据
 */
router.get('/data', function (req, res, next) {
    var data = fs.readFileSync('./data/data.json','utf-8');
    data = JSON.parse(data);
    //处理data
    res.send(util.shuffleData(data));
    res.end();
}); 
module.exports = router;
