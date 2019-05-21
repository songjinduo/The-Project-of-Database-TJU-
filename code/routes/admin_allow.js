var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysqlconfig = require('../config/mysqlConfig');
var sqlmap = require('../config/sqlMap');
var fs = require('fs');

router.get('/', function(req, res, next) {
    console.log(req);
    res.render('./admin/2', {title:'苏长庚'});
});

router.post('/', function(req, res, next) {
    console.log(req);
    res.render('./admin', {title:'苏长庚'})
});

module.exports = router;