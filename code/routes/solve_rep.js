var express = require('express');
var router = express.Router();
var mysqlconfig = require('../config/mysqlConfig');
/*
* 处理问题申请的解决状态
* 1. 学生点击"正在解决"申请, 可以确认"已解决"
* 2. 维修人员点击"未解决"申请, 可以前往"正在解决". 并为该申请分配维修人员编号.
* 3. 注意: 维修人员编号与学生学号不一样, 是INTEGER类型, 不能太大. 否则会出错.
* 4. <-- 这里需要获取维修人员信息, 到时候和登录页面协调一下. -->
* */
router.get('/', function(req, res, next) {
	console.log("appId: ", req.query["appId"]);
	console.log("identity: ", req.query["identity"]);
	var mysql = require("mysql");
	var connection = mysql.createConnection(mysqlconfig.mysqlPrc1);
	/*
	* 根据传入的信息更新数据库
	* */
	connection.connect(function(err) {
		if (err) {
			console.log("与MySQL数据库建立连接失败.");
		}
		else {
			console.log("与MySQL数据库建立连接成功.");
		}
	});
	
	try {
		var currentDate = (new Date()).toLocaleDateString();
		var str;
		var sql;
		var data;
		if (req.query.identity == "student") {
			/* 若是学生, 则更新为已解决, 并附上解决日期 */
			str = "已解决";
			sql = "UPDATE ApplicationForMaintenance SET solved= ?,solvedDate=? WHERE appId = ?";
			data = [str, currentDate, req.query["appId"]];
		}
		else {
			/* 若不是学生, 则是维修人员. 需要更新状态为"正在解决", 并分配该维修人员id */
			str = "正在解决";
			sql = "UPDATE ApplicationForMaintenance SET solved=?, repairmanId=? WHERE appId = ?";
			
			console.log("用户编号: ", req.session.userName);    /* 这里到时候要确认维修人员id获取方式. */
			
			data = [str, req.session.userName, req.query["appId"]];
		}
		
		
		var f = function(err, result) {
			if (err) {
				console.log("更新数据失败");
			}
			else {
				console.log("更新数据成功");
			}
		};
		console.log("sql: ", sql);
		console.log("data: ", data);
		
		connection.query(sql, data, f);
	}
	catch (e) {
		console.log("更新数据库时发生错误: ", e);
	}
	
	if (req.query.identity == "student") {
		res.redirect("/rep_status");
	}
	else {
		res.redirect("/repair");
	}
});

module.exports = router;
