var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('intro', { title: '假期宿舍管理系统简介' , text:'假期愉快！'});
});

module.exports = router;