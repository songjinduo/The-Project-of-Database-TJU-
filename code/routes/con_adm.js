var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('con_adm', { title: '联系管理员' , text:'假期愉快！'});
});

module.exports = router;