var express = require('express');
var router = express.Router();
var mysqlconfig = require('../config/mysqlConfig');
/*
* 显示学生视图的维修状态
* */
router.get('/', function(req, res, next) {
	console.log("进入rep_status");
	
	var mysql = require("mysql");
	var connection = mysql.createConnection(mysqlconfig.mysqlPrc1);
	try {
		var sql = "SELECT * FROM ApplicationForMaintenance WHERE studentId = ?"; // 这里的?相当于一个占位符, 到时后需要使用数组来传数据
		var data = req.signedCookies.userId;
		console.log("req.session.id: ", data);
		
		// 回调函数返回操作的状态err, 以及操作的结果result.
		var f = function(err, result) {
			if (err) {
				console.log("查询数据失败");
				res.send("查询数据失败");
			}
			else {
				console.log("查询数据成功.");
				for (var row in result) {
					if (result[row]["solvedDate"] == undefined) {
						result[row]["solvedDate"] = "未解决";
					}
					else {
						result[row]["solvedDate"] = result[row]["solvedDate"].toLocaleDateString();
					}
					result[row]["applyDate"] = result[row]["applyDate"].toLocaleDateString();
				}
				res.render("rep_status", {"records":result, title: '联系维修人员' , text:'假期愉快！'});
			}
		};
		
		connection.query(sql, data, f);
		
	}
	catch (e) {
		console.log(e);
	}
	finally {
		connection.end(); // 结束连接
	}
});

module.exports = router;
