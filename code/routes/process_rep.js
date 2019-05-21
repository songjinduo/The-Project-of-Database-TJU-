var express = require('express');
var router = express.Router();
var mysqlconfig = require('../config/mysqlConfig');
/*
* 处理维修申请表.
* 1. 将数据从post方法体中提出来
* 2. 利用这些填写的数据更新数据库
* 3. 获取更新后的该学生提交的所有记录, 要求能从会话中获取学生学号 studentId
* 4. 跳转到该学生所提交过的所有申请页面 rep_status
* */
router.get('/', function(req, res, next) {
    console.log('维修界面');
    res.send("get 处理成功.");
});

router.post('/', function(req, res, next) {
  console.log("req.body:", typeof(req.body));
  console.log(req.body);
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
  
  var buildingId = req.body["buildingId"];
  var repairItem = req.body["repairItem"];
  var roomId = req.body["roomId"];
  var studentId = req.signedCookies.userId;
  var phoneNumber = req.body["phoneNumber"];
  var date = req.body["date"];
  var time = req.body["time"];
  var description = req.body["description"];
  var applyDate = new Date();
  var applyDateStr = applyDate.toLocaleDateString();
  console.log(req.signedCookies);
  try {
      var sql = "INSERT INTO ApplicationForMaintenance set ?";
      console.log("学生Id: ", studentId);
      var data = {"studentId":studentId, "repairItem":repairItem, "roomId":roomId, "spareDate":date, "spareTime":time, "description":description, "applyDate":applyDateStr, "buildingId":buildingId, "phoneNumber":phoneNumber};
      
      var f = function(err, result) {
      if (err) {
          throw err;
        console.log("插入数据失败");
      }
      else {
        console.log("插入数据成功");
      }
    };
    connection.query(sql, data, f);
  }
  catch (e) {
      console.log("插入数据库时发生错误: ", e);
  }
  
  /*
  * 查询更新后的数据库数据.
  * */
  
  try {
    sql = "SELECT * FROM ApplicationForMaintenance WHERE studentId = ?";
    var data = req.signedCookies.userId;
  
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
        res.render("rep_status", {"records":result});
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
