var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysqlconfig = require('../config/mysqlConfig');
var sqlmap = require('../config/sqlMap');
var fs = require('fs');

var pool = mysql.createConnection(mysqlconfig.mysqlPrc1);

pool.connect(function(err){
  if(err){
    console.log('[query] - :'+err);
    return;
}
  console.log('[connection connect]  succeed!');
});

function saveDate(path,data,operation){    //异步方式
  if(operation=='r'){
    fs.writeFile(path,  data,  function  (err)  {
      if  (err)  {
        throw  err;
      }
      //console.log('写入成功');  //文件被保存
    });
  }else if(operation=='a'){
    fs.appendFile(path,  data,  function  (err)  {
      if  (err)  {
        throw  err;
      }
      //console.log('写入成功');  //文件被保存
    });
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log(req.session);
  if(req.session!=undefined)
      req.session.destroy();

  res.render('index', { title: '假期宿舍管理系统' , text:'假期愉快！'});
});

module.exports = router;
