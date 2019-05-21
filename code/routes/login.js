var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysqlconfig = require('../config/mysqlConfig');
var sqlmap = require('../config/sqlMap');

var pool = mysql.createConnection(mysqlconfig.mysqlPrc1);

function Middle(req,res){
    res.render('login',{title:'登录'});
}
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('Middle');
    Middle(req,res);
});

router.post('/', function (req, res, next) {
    //console.log('124')
    //console.log(req.body);
    var id = req.body['id'];
    var pwd = req.body['pwd'];
    //console.log(pwd);
    //数据库比对，确定是否可以登录


    res.cookie("userId", id, {signed:true});
    pool.connect(function(err){
        if(err){
            console.log('[query] - :'+err);
            return;
        }
        console.log('[connection connect]  succeed!');
    });

    pool.query(sqlmap.checklogin_stu, id, function (error, result) {//学生
        //console.log(result);
        if (error){
            throw error;
        }
        else if(result.length==0){
            //console.log('132');
            pool.query(sqlmap.checklogin_adm, id, function (error, result) {//管理员
                if(error) throw error;
                else if(result.length==0){
                    pool.query(sqlmap.checklogin_rep, id, function (error, result) {//维修人员
                        if(error) throw error;
                        else if(result.length==0){
                            res.render('login', {flag: 2});
                        }
                        else{
                            if(result[0]['passwd']==pwd){
                                var session = req.session;
                                session['name'] = result[0]['name'];
                                session['pwd'] = result[0]['pwd'];
                                session['id'] = id;
                                res.redirect('/repair');
                            }
                            else{
                                res.render('login', {flag: 1});
                            }
                        }
                    });
                }
                else{
                    if(result[0]['passwd']==pwd){
                        req.session.name = result[0]['name'];
                        //req.session.cookie.name = result[0]['name'];
                        req.session.myid=id;
                        res.redirect('/admin');
                    }
                    else{
                        res.render('login', {flag: 1});
                    }
                }
            });
        }
        else{
            if(result[0]['passwd']==pwd){
                var session = req.session;
                session['name'] = result[0]['name'];
                session['pwd'] = result[0]['pwd'];
                session['id'] = id;
                req.session.myid=id;
                res.redirect('/student');
            }
            else
            {
                res.render('login', {flag: 1});
            }
        }
    });

});

module.exports = router;