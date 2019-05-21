var express = require('express');
var router = express.Router();
var mysqlconfig = require('../config/mysqlConfig');
/*
* 显示维修人员视图的维修申请状态
* */

router.get('/', function(req, res, next) {
    var mysql = require("mysql");
    var connection = mysql.createConnection(mysqlconfig.mysqlPrc1);
    /*
	* 根据传入的信息到数据库插入数据.
	* */
    connection.connect(function(err) {
        if (err) {
            console.log("与MySQL数据库建立连接失败.");
        }
        else {
            console.log("与MySQL数据库建立连接成功.");
        }
    });
    
    /*
	* 查询所有维修申请数据
	* */
    try {
        var sql = "SELECT appId,buildingId,roomId,repairItem,applyDate,phoneNumber,spareDate,spareTime,solved,solvedDate FROM ApplicationForMaintenance";
        
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
                    
                    if (result[row]["applyDate"] != undefined) {
                        result[row]["applyDate"] = result[row]["applyDate"].toLocaleDateString();
                    }
                    if (result[row]["spareDate"] != undefined) {
                        result[row]["spareDate"] = result[row]["spareDate"].toLocaleDateString();
                    }
                }
                res.render("repair", {"records":result});
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