var express = require('express');
var router = express.Router();
var mysqlconfig = require('../config/mysqlConfig');

/*
* 学生提交维修申请的表单的页面.
* 1. 当在登录页面提交登录信息, 直接使用post方法跳转到该页面时, 捕获post方法
* 2. 当在登录页面验证登录信息, 根据身份使用普通方法跳转时, 捕获get方法
*    此时要求能够从会话中获取学生学号studentId.
* */


router.get('/', function(req, res, next) {
    console.log("进入con_rep.js");
    var session = req.session;
    console.log(session.name);
    if(session.name==undefined){
        res.render('./login');
    }
    var mysql = require("mysql");
    var connection = mysql.createConnection(mysqlconfig.mysqlPrc1);
    try {
        var sql = "SELECT * FROM DormitoryBuilding"; // 这里的?相当于一个占位符, 到时后需要使用数组来传数据
        
        // 回调函数返回操作的状态err, 以及操作的结果result.
        var f = function(err, result) {
            if (err) {
                console.log("查询数据失败");
                res.send("宿舍信息查询失败");
            }
            else {
                console.log("查询数据成功.");
                // console.log(result);
                res.render("con_rep", {result:result, title: '联系维修人员' , text:'假期愉快！'});
            }
        };
        
        connection.query(sql, f);
    }
    catch (e) {
        console.log(e);
    }
    finally {
        connection.end(); // 结束连接
    }
});

module.exports = router;