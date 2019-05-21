var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysqlconfig = require('../config/mysqlConfig');
var sqlmap = require('../config/sqlMap');
var fs = require('fs');

var pool = mysql.createConnection(mysqlconfig.mysqlPrc1);
var myid,myname,mysex,mybuildingid,myroomid;
var homepage = {page0:true};
function getTime(date)
{
    if(date == null)
    {
        date = new Date();
    }
    var y = date.getFullYear();
    var M = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var S = date.getTime()%1000;
    var html = y + "-";
    if(M < 10)
    {
        html += "0";
    }
    html += M + "-";

    if(d < 10)
    {
        html += "0";
    }
    html += d
    return html;
}

router.get('/', function(req, res, next) {
    homepage.page0=true;
    console.log(req.body);
    console.log(req.session);
    myid = req.session.myid;
    var session = req.session;
    var id = req.params['id'];
    pool.query(sqlmap.checkstu_info, myid, function (error, result){
        if (error) {
            throw error;
        }
        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        myname=result[0].name;
        mysex = result[0].sex;
        mybuildingid=result[0].buildingId;
        myroomid = result[0].roomId;
        res.render('student', {name: session['name'], homepage,res:result});
    });
});

router.get('/:id', function(req, res, next) {
    var id = req.params['id'];
    var session = req.session;
    console.log(session);
    var page = {
        page1: false,
        page2: false,
        page3: false,
        page4: false
    };
    var flag = {
        flag1:false,
        flag2:false,
        flag3:false,
        flag4:false
    };
    if(id==1) {
        homepage.page0 = false;
        page.page1 = true;
        pool.query(sqlmap.checkis_leave, myid, function (error, result){
            console.log(result);
            if (error) {
                throw error;
            }
            else if(result.length==0) {
                flag.flag1 = true;
                res.render('student', {name: session['name'], type: id, page ,flag});
            }
            else{
                var date = result[0].leavingDate;
                result[0].leavingDate = getTime(date);
                res.render('student', {name: session['name'], type: id, page ,flag, res:result});
            }
        });
    }


    else if(id==2){
        homepage.page0 = false;
        page.page2 = true;
        pool.query(sqlmap.checkis_return, myid, function (error, result){

            if (error) {
                throw error;
            }
            else if(result.length==0) {
                flag.flag2 = true;
                res.render('student', {name: session['name'], type: id, page ,flag});
            }
            else{
                var date = result[0].returningDate;
                result[0].returningDate = getTime(date);
                res.render('student', {name: session['name'], type: id, page ,flag, res:result});
            }
        });
    }


    else if(id==3) {
        homepage.page0 = false;
        page.page3 = true;
        pool.query(sqlmap.checkis_stay, myid, function (error, result){
            if (error) {
                throw error;
            }
            else if(result.length==0) {
                flag.flag3 = true;
                res.render('student', {name: session['name'], type: id, page ,flag});
            }
            else {//已登记留校申请
                pool.query(sqlmap.assign_info, myid, function (error, result) {//查询宿舍分配信息
                    if (error) throw error;
                    else if (result.length == 0) {//未分配宿舍
                        result[0].info = "宿舍分配失败，请联系宿舍管理员";
                        result[0].buildingId = null;
                        result[0].roomId = null;
                        console.log("宿舍分配失败");
                        res.render('student', {name: session['name'], type: id, page ,flag,myresult,res:result});
                    } else {//已分配宿舍
                        result[0].info = "宿舍分配成功";
                        console.log("宿舍分配成功11111111");
                        console.log(result);
                        res.render('student', {name: session['name'], type: id, page ,flag, myresult,res:result});
                    }
                });
                var date = result[0].beginTime;
                result[0].beginTime = getTime(date);
                var date = result[0].endTime;
                result[0].endTime = getTime(date);
                console.log(result);
                var myresult={
                    beginTime:result[0].beginTime,
                    endTime:result[0].endTime,
                    reason:result[0].reason
                }
                //res.render('student', {name: session['name'], type: id, page ,flag, res:result});
            }
        });
    }
    else if(id==4) {
        homepage.page0 = false;
        page.page4 = true;
        pool.query(sqlmap.checkis_night, myid, function (error, result){
            if (error) {
                throw error;
            }
            else if(result.length==0) {
                flag.flag4 = true;
                res.render('student', {name: session['name'], type: id, page ,flag});
            }
            else{
                res.render('student', {name: session['name'], type: id, page ,flag, res:result});
            }
        });
    }
});
router.post('/leave', function(req, res, next) {
    console.log(req.body);
    var mydate = req.body.date.substr(6,4)+'-'+req.body.date.substr(0,2)+'-'+req.body.date.substr(3,2);
    console.log(mydate);
    var param=[mydate,myid,myname,mybuildingid,myroomid,req.body.luggage,req.body.number];
    console.log(param);
    var param_update=[mydate,req.body.luggage,req.body.number,myid];
    console.log(param_update);
    pool.query(sqlmap.checkis_leave, myid, function (error, result) {
        if (error) {
            throw error;
        }
        else if(result.length==0) {
            pool.query(sqlmap.checkstu_leave, param, function (error, result) {
                if (error) {
                    throw error;
                    res.render('student', {submitflag: 100});
                } else
                    res.render('student', {submitflag: 101});
                    res.redirect('/student/1');
            });
        }
        else{
            if(req.body.update) {
                pool.query(sqlmap.updatestu_leave, param_update, function (error, result) {
                    if (error) {
                        throw error;
                        res.render('student', {submitflag: 100});
                    } else
                        res.render('student', {submitflag: 101});
                        res.redirect('/student/1');
                });
            }
            else if(req.body.cancel){
                pool.query(sqlmap.deletestu_leave, myid, function (error, result) {
                    if (error) {
                        throw error;
                        res.render('student', {submitflag: 100});
                    } else
                        res.render('student', {submitflag: 101});
                        res.redirect('/student/1');
                });
            }
        }
    });
});

router.post('/return', function(req, res, next) {
    console.log(req.body);
    var mydate = req.body.date.substr(6,4)+'-'+req.body.date.substr(0,2)+'-'+req.body.date.substr(3,2);
    console.log(mydate);
    var param=[mydate,myid,myname,mybuildingid,myroomid,req.body.luggage,req.body.number];
    console.log(param);
    var param_update=[mydate,req.body.luggage,req.body.number,myid];
    pool.query(sqlmap.checkis_return, myid, function (error, result){
        if (error) {
            throw error;
            res.render('student', {submitflag: 100});
        }
        else if(result.length==0) {
            pool.query(sqlmap.checkstu_return, param, function (error, result) {
                if (error) {
                    throw error;
                    res.render('student', {submitflag: 100});
                } else
                    res.render('student', {submitflag: 101});
                res.redirect('/student/2');
            });
        }
        else{
            if(req.body.update) {
                pool.query(sqlmap.updatestu_return, param_update, function (error, result) {
                    if (error) {
                        throw error;
                        res.render('student', {submitflag: 100});
                    } else
                        res.render('student', {submitflag: 101});
                    res.redirect('/student/2');
                });
            }
            else if(req.body.cancel){
                pool.query(sqlmap.deletestu_return, myid, function (error, result) {
                    if (error) {
                        throw error;
                        res.render('student', {submitflag: 100});
                    } else
                        res.render('student', {submitflag: 101});
                    res.redirect('/student/2');
                });
            }
        }
    });
});

router.post('/stay', function(req, res, next){
    console.log(req.body);
    var mydate1 = req.body.from.substr(6,4)+'-'+req.body.from.substr(0,2)+'-'+req.body.from.substr(3,2);
    var mydate2 = req.body.to.substr(6,4)+'-'+req.body.to.substr(0,2)+'-'+req.body.to.substr(3,2);
    var param = [myid,mydate1,mydate2,req.body.reason];
    var param_update=[mydate1,mydate2,req.body.reason,myid];
    console.log(param);
    console.log(param_update);
    pool.query(sqlmap.checkis_stay, myid, function (error, result){
        if (error) {
            throw error;
            res.render('student', {submitflag: 100});
        }
        else if(result.length==0) {//未登记过
            pool.query(sqlmap.checkstu_stay, param, function (error, result) {//信息插入宿舍申请表
                if (error) {
                    throw error;
                }
            });


            //分配假期的宿舍，女生宿舍楼为1号，男生宿舍楼为2号
            if (mysex == '男') {
                var myassign_building = 2;
                //找剩余1个床的宿舍
                var param_assign1 = [2, 1];
                pool.query(sqlmap.find_dormitory, param_assign1, function (error, result) {
                    var myassign_room;
                    console.log(result);
                    console.log(result[0].assign_room);
                    if (error) {
                        throw error;
                    }
                    else if (result[0].assign_room == null) {
                        //找剩余2个床的宿舍
                        var param_assign2 = [2, 2];
                        pool.query(sqlmap.find_dormitory, param_assign2, function (error, result) {
                            console.log(result);
                            console.log(result[0].assign_room);
                            if (error) {
                                throw error;
                            }
                            //找剩余3个床的宿舍
                            else if (result[0].assign_room == null) {
                                var param_assign3 = [2, 3];
                                pool.query(sqlmap.find_dormitory, param_assign3, function (error, result) {
                                    console.log(result);
                                    console.log(result[0].assign_room);
                                    if (error) {
                                        throw error;
                                    }
                                    //找剩余4个床的宿舍
                                    else if (result[0].assign_room == null) {
                                        var param_assign4 = [2, 4];
                                        pool.query(sqlmap.find_dormitory, param_assign4, function (error, result) {
                                            console.log(result);
                                            console.log(result[0].assign_room);
                                            if (error) {
                                                throw error;
                                            }
                                            //无床位
                                            else if (result[0].assign_room == null) {
                                                console.log("无剩余床位");
                                                myassign_building = 0;
                                                myassign_room = 0;
                                                res.render('student', {submitflag: 102});
                                                res.redirect('/student/3');
                                            }
                                            else {
                                                console.log("查到的宿舍为：")
                                                console.log(result);
                                                console.log(result[0].assign_room);
                                                myassign_room = result[0].assign_room;
                                                console.log("宿舍分配成功");
                                                console.log(myassign_building);
                                                console.log(myassign_room);
                                                var param_in = [myid, myassign_building, myassign_room];//用于插入Accommodation表
                                                pool.query(sqlmap.assign_dormitory, param_in, function (error, result) {
                                                    if (error) {
                                                        throw error;
                                                        res.render('student', {submitflag: 100});
                                                    } else {
                                                        res.render('student', {submitflag: 101});
                                                    }
                                                });
                                                res.redirect('/student/3');
                                            }
                                        });
                                    } else {
                                        console.log("查到的宿舍为：")
                                        console.log(result);
                                        console.log(result[0].assign_room);
                                        myassign_room = result[0].assign_room ;
                                        console.log("宿舍分配成功");
                                        console.log(myassign_building);
                                        console.log(myassign_room);
                                        var param_in = [myid, myassign_building, myassign_room];//用于插入Accommodation表
                                        pool.query(sqlmap.assign_dormitory, param_in, function (error, result) {
                                            if (error) {
                                                throw error;
                                                res.render('student', {submitflag: 100});
                                            } else {
                                                res.render('student', {submitflag: 101});
                                            }
                                        });
                                        res.redirect('/student/3');
                                    }
                                });
                            }
                            else {
                                console.log("查到的宿舍为：")
                                console.log(result);
                                console.log(result[0].assign_room);
                                myassign_room = result[0].assign_room ;
                                console.log("宿舍分配成功");
                                console.log(myassign_building);
                                console.log(myassign_room);
                                var param_in = [myid, myassign_building, myassign_room];//用于插入Accommodation表
                                pool.query(sqlmap.assign_dormitory, param_in, function (error, result) {
                                    if (error) {
                                        throw error;
                                        res.render('student', {submitflag: 100});
                                    } else {
                                        res.render('student', {submitflag: 101});
                                    }
                                });
                                res.redirect('/student/3');
                            }
                        });
                    }
                    else {
                        console.log("查到的宿舍为：")
                        console.log(result);
                        console.log(result[0].assign_room);
                        myassign_room = result[0].assign_room ;
                        console.log("宿舍分配成功");
                        console.log(myassign_building);
                        console.log(myassign_room);
                        var param_in = [myid, myassign_building, myassign_room];//用于插入Accommodation表
                        pool.query(sqlmap.assign_dormitory, param_in, function (error, result) {
                            if (error) {
                                throw error;
                                res.render('student', {submitflag: 100});
                            } else {
                                res.render('student', {submitflag: 101});
                            }
                        });
                        res.redirect('/student/3');
                    }
                });
            }



            else if (mysex == '女') {
                var myassign_building = 1;
                //找剩余1个床的宿舍
                var param_assign1 = [1, 1];
                pool.query(sqlmap.find_dormitory, param_assign1, function (error, result) {
                    var myassign_room;
                    console.log(result);
                    console.log(result[0].assign_room);
                    if (error) {
                        throw error;
                    }
                    else if (result[0].assign_room == null) {
                        //找剩余2个床的宿舍
                        var param_assign2 = [1, 2];
                        pool.query(sqlmap.find_dormitory, param_assign2, function (error, result) {
                            console.log(result);
                            console.log(result[0].assign_room);
                            if (error) {
                                throw error;
                            }
                            //找剩余3个床的宿舍
                            else if (result[0].assign_room == null) {
                                var param_assign3 = [1, 3];
                                pool.query(sqlmap.find_dormitory, param_assign3, function (error, result) {
                                    console.log(result);
                                    console.log(result[0].assign_room);
                                    if (error) {
                                        throw error;
                                    }
                                    //找剩余4个床的宿舍
                                    else if (result[0].assign_room == null) {
                                        var param_assign4 = [1, 4];
                                        pool.query(sqlmap.find_dormitory, param_assign4, function (error, result) {
                                            console.log(result);
                                            console.log(result[0].assign_room);
                                            if (error) {
                                                throw error;
                                            }
                                            //无床位
                                            else if (result[0].assign_room == null) {
                                                console.log("无剩余床位");
                                                myassign_building = 0;
                                                myassign_room = 0;
                                                res.render('student', {submitflag: 102});
                                                res.redirect('/student/3');
                                            }
                                            else {
                                                console.log("查到的宿舍为：")
                                                console.log(result);
                                                console.log(result[0].assign_room);
                                                myassign_room = result[0].assign_room;
                                                console.log("宿舍分配成功");
                                                console.log(myassign_building);
                                                console.log(myassign_room);
                                                var param_in = [myid, myassign_building, myassign_room];//用于插入Accommodation表
                                                pool.query(sqlmap.assign_dormitory, param_in, function (error, result) {
                                                    if (error) {
                                                        throw error;
                                                        res.render('student', {submitflag: 100});
                                                    } else {
                                                        res.render('student', {submitflag: 101});
                                                    }
                                                });
                                                res.redirect('/student/3');
                                            }
                                        });
                                    } else {
                                        console.log("查到的宿舍为：")
                                        console.log(result);
                                        console.log(result[0].assign_room);
                                        myassign_room = result[0].assign_room ;
                                        console.log("宿舍分配成功");
                                        console.log(myassign_building);
                                        console.log(myassign_room);
                                        var param_in = [myid, myassign_building, myassign_room];//用于插入Accommodation表
                                        pool.query(sqlmap.assign_dormitory, param_in, function (error, result) {
                                            if (error) {
                                                throw error;
                                                res.render('student', {submitflag: 100});
                                            } else {
                                                res.render('student', {submitflag: 101});
                                            }
                                        });
                                        res.redirect('/student/3');
                                    }
                                });
                            }
                            else {
                                console.log("查到的宿舍为：")
                                console.log(result);
                                console.log(result[0].assign_room);
                                myassign_room = result[0].assign_room ;
                                console.log("宿舍分配成功");
                                console.log(myassign_building);
                                console.log(myassign_room);
                                var param_in = [myid, myassign_building, myassign_room];//用于插入Accommodation表
                                pool.query(sqlmap.assign_dormitory, param_in, function (error, result) {
                                    if (error) {
                                        throw error;
                                        res.render('student', {submitflag: 100});
                                    } else {
                                        res.render('student', {submitflag: 101});
                                    }
                                });
                                res.redirect('/student/3');
                            }
                        });
                    }
                    else {
                        console.log("查到的宿舍为：")
                        console.log(result);
                        console.log(result[0].assign_room);
                        myassign_room = result[0].assign_room ;
                        console.log("宿舍分配成功");
                        console.log(myassign_building);
                        console.log(myassign_room);
                        var param_in = [myid, myassign_building, myassign_room];//用于插入Accommodation表
                        pool.query(sqlmap.assign_dormitory, param_in, function (error, result) {
                            if (error) {
                                throw error;
                                res.render('student', {submitflag: 100});
                            } else {
                                res.render('student', {submitflag: 101});
                            }
                        });
                        res.redirect('/student/3');
                    }
                });
            }
        }

        else{//已登记
            if(req.body.update) {
                pool.query(sqlmap.updatestu_stay, param_update, function (error, result) {
                    if (error) {
                        throw error;
                        res.render('student', {submitflag: 100});
                    } else
                        res.render('student', {submitflag: 101});
                    res.redirect('/student/3');
                });
            }
            else if(req.body.cancel){
                pool.query(sqlmap.deletestu_stay, myid, function (error, result) {
                    if (error) {
                        throw error;
                    }
                });
                pool.query(sqlmap.delete_assign, myid, function (error, result) {
                    if (error) {
                        throw error;
                        res.render('student', {submitflag: 100});
                    } else
                        res.render('student', {submitflag: 101});
                    res.redirect('/student/3');
                });
            }
        }
    });
});
router.post('/night', function(req, res, next) {
    console.log(req.body);
    var sd = require('silly-datetime');
    var time = sd.format(new Date(), 'YYYY-MM-DD');
    console.log(time);
    var myanswer;
    if(req.body.answer=='是')
        myanswer='Yes';
    else if(req.body.answer=='否')
        myanswer='No';
    var param=[myid,time,myanswer];
    var param_update=[myanswer,myid];
    console.log(param);
    pool.query(sqlmap.checkis_night, myid, function (error, result){
        if (error) {
            throw error;
            res.render('student', {submitflag: 100});
        }
        else if(result.length==0) {
            pool.query(sqlmap.checkstu_night, param, function (error, result) {
                if (error) {
                    throw error;
                    res.render('student', {submitflag: 100});
                } else
                    res.render('student', {submitflag: 101});
                res.redirect('/student/4');
            });
        }
        else{
            if(req.body.answer) {
                pool.query(sqlmap.updatestu_night, param_update, function (error, result) {
                    if (error) {
                        throw error;
                        res.render('student', {submitflag: 100});
                    } else
                        res.render('student', {submitflag: 101});
                    res.redirect('/student/4');
                });
            }
            else if(req.body.cancel){
                pool.query(sqlmap.deletestu_night, myid, function (error, result) {
                    if (error) {
                        throw error;
                        res.render('student', {submitflag: 100});
                    } else
                        res.render('student', {submitflag: 101});
                    res.redirect('/student/4');
                });
            }
        }
    });
});
pool.connect(function(err){
    if(err){
        console.log('[query] - :'+err);
        return;
    }
    console.log('[connection connect]  succeed!');
});


module.exports = router;