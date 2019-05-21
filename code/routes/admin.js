var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysqlconfig = require('../config/mysqlConfig');
var sqlmap = require('../config/sqlMap');
var fs = require('fs');
var async = require('async');

var pool = mysql.createConnection(mysqlconfig.mysqlPrc1);
var adm_name = null;

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

async function getData(sql, path, param){//异步加载有问题，待解决？？？
    var name = [['大一', '大二', '大三', '大四'],
        ['计算机科学与技术学院', '建筑学院', '化工学院', '文学院', '机械学院', '教育学院'],
        ['男生', '女生']];
    var values = [];
    var len = param.length;
    for(var i=0; i<len; i++){
        pool.query(sql, param[i], function (error, result) {//学生
            //console.log(result);
            if (error) {
                throw error;
            }

            var value = result[0]['sum'];
            values.push({"value": value, "name": name[i]});
            //console.log(values);
            if(i==len-1){
                var data = JSON.stringify(values);
                //console.log(data);
                saveDate(path, data);
            }
        });
    }
}

//异步
function getDate(date){//将日期转化为合适的格式
    //console.log(String(date));
    var month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var year = Number(date.getFullYear());
    var mon = Number(date.getMonth())+1;
    var day = Number(date.getDate());

    if(day<month[mon]){
        day = day;
    }else{
        mon = mon+1;
        day = 1;
    }
    var d = String(year)+'-'+String(mon)+'-'+String(day);
    //console.log(d);
    return d;
}

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
    html += d + " ";
    if(h < 10)
    {
        html += "0";
    }
    html += h + ":";
    if(m < 10)
    {
        html += "0";
    }
    html += m + ":";
    if(s < 10)
    {
        html += "0";
    }
    html += s;

    return html;
}

/* GET users listing. */
router.get('/', function(req, res, next) {//初始页加载Echarts图
    var session = req.session;
    adm_name = session['name'];
    //console.log(session);
    var page = {
        page1: false,
        page2: false,
        page3: false,
        page4: false
    };

    //获取数据库的数据，并写入文件————————————————————————————————————————————————————
    var path = ['../untitled/public/data/grade.json', '../untitled/public/data/college.json', '../untitled/public/data/sex.json']
    var param = [[2018, 2017, 2016, 2015],
        ['智能与计算学部', '材料科学与工程学院', '机械工程学院', '建筑工程学院', '化工学院', '管理与经济学部', '建筑学院', '环境科学与工程学院',
            '法学院', '精密仪器与光电子工程学院', '生命科学学院', '电气自动化与信息工程学院', '海洋科学与技术学院', '求是学部', ' 理学院', '医学科学与工程学院'],
                  ['男', '女']];
    var name = [['大一', '大二', '大三', '大四'],
                ['智能与计算学部', '材料科学与工程学院', '机械工程学院', '建筑工程学院', '化工学院', '管理与经济学部', '建筑学院', '环境科学与工程学院',
                    '法学院', '精密仪器与光电子工程学院', '生命科学学院', '电气自动化与信息工程学院', '海洋科学与技术学院', '求是学部', ' 理学院', '医学科学与工程学院'],
                ['男生', '女生']];
    var sql = [sqlmap.checkadmin_stu_grade + ' and S.studentId in (' + sqlmap.checkadmin_acco + ')',
                sqlmap.checkadmin_stu_college + ' and S.studentId in (' + sqlmap.checkadmin_acco + ')',
                sqlmap.checkadmin_stu_sex + ' and S.studentId in (' + sqlmap.checkadmin_acco + ')'];
    var values = [];
    var DATA = "[";
    //grade--------------------------
    var num = 0;
    var G = "";
    //console.log(sql[num]);

    for(var i=0; i<name[num].length; i++) {
        console.log("grade"+name[num].length);
        (function (i) {
            pool.query(sql[num], param[num][i], function (error, result) {
                values = [];
                //console.log(result);
                if (error) {
                    throw error;
                }
                //console.log(result[0]['sum']);
                var value = result[0]['sum'];
                var data =JSON.stringify({"value": value, "name": name[num][i]});

                if(i==0){
                    G = G+'['+data;
                }else{
                    G = G+','+data;
                }
                console.log("sex"+i);
                if(i==name[num].length-1) {
                    G = G+']';
                    //console.log(G);
                    DATA = DATA+G+',';
                    //console.log(DATA);
                }
            });
        })(i);
    }

    //sex---------------------------------------------------------------
    var nums = 2;
    var S = "";

    for(var i=0; i<name[nums].length; i++) {
        console.log("sex"+name[nums].length);
        (function (i) {
            pool.query(sql[nums], param[nums][i], function (error, result) {//学生
                values = [];
                //console.log(result);
                if (error) {
                    throw error;
                }
                //console.log(result[0]['sum']);
                var value = result[0]['sum'];
                var data =JSON.stringify({"value": value, "name": name[nums][i]});
                if(i==0){
                    S = S+'['+data;
                }else{
                    S = S+','+data;
                }
                //console.log("sex"+i);
                if(i==name[nums].length-1) {
                    S = S+']';
                    //console.log(S);
                    //console.log(JSON.stringify(S));
                    DATA = DATA+S+",";
                    //console.log(DATA);
                }
            });
        })(i);
    }

    //college-----------------------------------------
    //console.log(sql[num]);
    var numc = 1;
    values = [];
    //console.log("college的个数为"+name[numc].length);
    var D = "";

    for(var i=0; i<name[numc].length; i++){
        //console.log("college"+i);
        (function (i) {
            pool.query(sql[numc], param[numc][i], function (error, result) {//学生
                //console.log(name[numc].length);
                values = [];
                //console.log(result);
                if (error) {
                    throw error;
                }

                if(result[0]['sum']>0){
                    var value = result[0]['sum'];
                    var data =JSON.stringify({"value": value, "name": name[numc][i]});
                    if(i!=0){
                        //saveDate('../data/college.json', ','+data, 'a');
                        //saveDate('./public/data/college.json', ','+data, 'a');
                        D = D+','+data;
                    }else{
                        //saveDate('../data/college.json', '['+ data, 'r');
                        //saveDate('./public/data/college.json', '['+data, 'r');
                        D = D+'['+data;
                    }
                }

                //console.log("college"+i);
                if(i==name[numc].length-1){

                    D = D+']';
                    //console.log(D);
                    DATA = DATA+D+"]";
                    //DATA.push(D);
                    console.log(DATA);
                    saveDate('./public/data/data.json', DATA, 'r');
                }
                //console.log("college"+i);
            });
        })(i);
    }

    //------------------------------------------------------------------------------------------------------------------
    req.session['name'] = session['name'];
    res.render('admin', {name:  session['name'], type: 0, page});
});

router.get('/:id', function(req, res, next) {//分页
    var id = req.params['id'];
    var session = req.session;
    console.log(session);
    console.log(adm_name);
    var page = {
        page1: false,
        page2: false,
        page3: false,
        page4: false
    };
    if(id==1) page.page1 = true;
    else if(id==2) page.page2 = true;
    else if(id==3) page.page3 = true;
    else if(id==4) page.page4 = true;
    res.render('admin', {name: session['name'], type: id, page});
});

router.post('/reg_update',function (req, res, next) {
    console.log('进入req.update');
    var session = req.session;
    var page = {
        page1: false,
        page2: false,
        page3: false,
        page4: false
    };
    page.page2 = true;
    console.log(req.body);
    var date = new Date()

    var param = [];
    date = getTime(date);
    param.push(date);
    for(var key in req.body){
        param.push(Number(key));
    }
    console.log(param);
    var sql0 = sqlmap.updateadmin_reg;
    pool.query(sql0, param, function (error, result) {
        console.log(result);
        if (error) {
            throw error;
        }
        console.log('更新成功');
        res.render('admin', {name:  session['name'], type: 2, page});
    });

})

router.post('/reg', function (req, res, next) {//入楼登记和查询
    var session = req.session;
    var page = {
        page1: false,
        page2: false,
        page3: false,
        page4: false
    };
    page.page2 = true;
   // console.log('123')
    //console.log(req.body);
    var name = req.body['name'];
    var apartment = req.body['apartment'];

    if(typeof(apartment)!="undefined"){//来访登记
        var room = req.body['id'];//来访宿舍号
        var now = new Date();
        var time = getTime(now);
        //console.log(time);
        var id = 1;
        var sql0 = sqlmap.checkadmin_reg_max;
        var param = [];
        //console.log(sql0);
        pool.query(sql0, function (error, result) {//在登记表中查询ID学生的登记信息，该表中的学生一定是寒假留宿的
            console.log(result);
            if (error) {
                throw error;
            }
            console.log(result[0]['max']);
            id = result[0]['max']+1;
            //console.log(id);
            param = [id, name, time, apartment];
            //console.log(param);
            var sql1 = sqlmap.insertadmin_reg;
            pool.query(sql1, param, function (error, result) {
                //console.log(result);
                if (error) {
                    throw error;
                }
                //console.log(result);
            });
            res.render('admin', {name:  session['name'], type: 2, page});
        });
    }else{//查询和出楼
        var sql2 = sqlmap.checkadmin_reg;
        var param = [];
        var where = req.body['where'];
        if(name!=''){
            param.push(name);
            sql2 = sql2 + ' V.visitorName = ?';
            if(where!='isnull'){
                if(where=='in')
                    sql2 = sql2+' and V.leaveTime is null';
                else
                    sql2 = sql2+' and V.leaveTime is not null';
            }
        }else{
            if(where!='isnull'){
                if(where=='in')
                    sql2 = sql2+' V.leaveTime is null';
                else
                    sql2 = sql2+' V.leaveTime is not null';
            }
        }

        pool.query(sql2, param, function (error, result) {
            console.log(result);
            if (error) {
                throw error;
            }
            var length = result.length;
            for(var i=0; i<length; i++){
                if(result[i]['leaveTime']!=null){
                    var year = result[i]['leaveTime'].getFullYear();
                    var month = result[i]['leaveTime'].getMonth();
                    var day = result[i]['leaveTime'].getDate();
                    var hour = result[i]['leaveTime'].getHours();
                    var minute = result[i]['leaveTime'].getMinutes();
                    var second = result[i]['leaveTime'].getSeconds();
                    var time = String(year)+'-'+String(month)+'-'+String(day)+'   '+String(hour)+':'+String(minute)+':'+String(second);
                    //console.log(time);
                    result[i]['leaveTime'] = time;
                }

                var year = result[i]['enterTime'].getFullYear();
                var month = result[i]['enterTime'].getMonth();
                var day = result[i]['enterTime'].getDate();
                var hour = result[i]['enterTime'].getHours();
                var minute = result[i]['enterTime'].getMinutes();
                var second = result[i]['enterTime'].getSeconds();
                var time = String(year)+'-'+String(month)+'-'+String(day)+'   '+String(hour)+':'+String(minute)+':'+String(second);
                //console.log(time);
                result[i]['enterTime'] = time;
            }
            res.render('admin', {name:  session['name'], type: 2, page, visitors: result});
        });
    }
})

router.post('/modify', function (req, res, next) {//修改学生的宿舍
    //console.log(req.body['apartment']);
    //console.log(req.body);
    var session = req.session;
    var param = [];
    var page = {
        page1: false,
        page2: false,
        page3: false,
        page4: false
    };
    if(typeof(req.body['apartment'])!='undefined'){
        var apartment = Number(req.body['apartment']);
        var roomid = Number(req.body['id']);
        var sql = sqlmap.modifyadmin_stu;
        param.push(apartment);
        param.push(roomid);
        for(var key in req.body){
            if(key[0]=='3'){
                param.push(key);
            }
        }
        console.log(param);
        pool.query(sql, param,function (error, result) {//在登记表中查询ID学生的登记信息，该表中的学生一定是寒假留宿的
            console.log(result);
            if (error) {
                throw error;
            }
            page.page1 = true;
            res.render('admin', {name: session['name'], page});
        });
    }else{
        for(var key in req.body){
            param.push(Number(key));
        }
        console.log(param);
        var sql0 = sqlmap.checkadmin_stu_mes + " S.studentId = ?";
        pool.query(sql0, param, function (error, result) {//在登记表中查询ID学生的登记信息，该表中的学生一定是寒假留宿的
            console.log(result[0]);
            if (error) {
                throw error;
            }
            var r = [result[0]];
            res.render('modify', {name: session['name'], stu_mes: r});
        });
    }
})

router.post('/', function (req, res, next) {
    //console.log(req.body)
    var page = {
        page1: false,
        page2: false,
        page3: false,
        page4: false
    };

//前台的传入
    //查询
    var session = req.session;
    console.log(session);
    var institute = req.body['institute'];
    var Year = req.body['Year'];
    var sex = req.body['sex'];
    var id = req.body['stu_id'];
    //夜宿查询
    var id2 = req.body['stu_id2'];
    var register = req.body['register'];
    var date = req.body['date'];

    if(typeof(date)!="undefined")
        date = date.substr(6, 4)+'-'+date.substr(0, 2)+'-'+date.substr(3, 2);

    var paramdate = [];
    var paramyn = [];
    var param = [];
    //console.log(date);
    //console.log(typeof(register));
    if(typeof(register)!="undefined"){//夜宿
        console.log('夜宿');
        var sql0 = sqlmap.checkadmin_stu_mes;
        var sql1 = sqlmap.checkadmin_stuId_night;
        var sql2 = sqlmap.checkadmin_stu_night;
        page.page3 = true;
        if(id2!=''){
            sql2 = sql2 + ' N.studentId = ?';
            pool.query(sql2, id2, function (error, result) {//在登记表中查询ID学生的登记信息，该表中的学生一定是寒假留宿的
                //console.log(result);
                if (error) {
                    throw error;
                }
                //console.log(result);
                var length = result.length;
                console.log(length);
                for(var i=0; i<length; i++){
                    var yn = result[i].YN;
                    var date = getDate(result[i].accomDate);
                    paramdate.push(date);
                    paramyn.push(yn);
                }
            });
            console.log(paramdate);
            //console.log(result[0].accomDate);
            sql0 = sql0 + ' S.studentId = ?';
            pool.query(sql0, id2, function (error, result) {//
                //console.log(result);
                if (error) {
                    throw error;
                }
                var length = paramdate.length;
                var rq = [];
                console.log(length);
                for (var i = 0; i < length; i++) {//显示转化
                    var m = {};
                    for(var item in result[0]){
                        m[item] = result[0][item];
                    }
                    m.date = paramdate[i];
                    if (paramyn[i] == 'Yes') m.register = '夜宿';
                    else m.register = '不夜宿';
                    //console.log(m);
                    rq.push(m);
                   // console.log(r);
                }
                //console.log(rq);
                res.render('admin', {name: session['name'], stu_mes2: rq, page});
            });
        }
        else{
            var sql = sql0 + ' S.studentId in (' + sql1;
            sql = sql + ' N.YN = ?';
            sql = sql + ' and N.accomDate = ?)';

            console.log(sql);
            //sql1 = sql1 + ' and '
            param.push(register);
            param.push(date);

            if(sex!='isnull'){
                sql = sql + ' and S.sex = ?';
                param.push(sex);
            }
            console.log(sql);
            pool.query(sql, param, function (error, result) {//学生
                //console.log(result);
                if (error) {
                    throw error;
                }
                console.log(result.length);
                var length = result.length;
                for(var i=0; i<length; i++){//显示转化
                    result[i].date = param[1];
                    if(param[0]=='Yes') result[i].register = '已登记';
                    else                result[i].register = '未登记';
                }
                //console.log(result);
                res.render('admin', {name: session['name'], stu_mes2: result, page});
            });
        }
    }
    else{//查询
        console.log('查询')
        if(Year!='isnull'){
            Year = Number(Year);
        }
        console.log(Year);

        var sql = sqlmap.checkadmin_stu_mes0;
        //console.log(sql);
        if(id!=''){
            param.push(id);
            sql = sql + ' S.studentId = ?';
        }
        else{
            if(institute!='isnull'){
                param.push(institute);
                sql = sql + ' S.college = ?';
            }
            if(Year!='isnull'){
                if(param.length>0) sql = sql + ' and';
                sql = sql + ' S.grade = ?';
                param.push(Year);
            }
            if(sex!='isnull'){
                if(param.length>0) sql = sql + ' and';
                sql = sql + ' S.sex = ?';
                param.push(sex);
            }
        }
        //sql = sql + ' and S.studentId in (' + sqlmap.checkadmin_acco + ')';
        console.log(sql);
        console.log(param);

        var sqljoin = sql + ' and S.studentId = A.studentId';
        pool.query(sqljoin, param, function (error, result) {
            //console.log(result);
            if (error) {
                throw error;
            }
            /*
            //console.log(result[0].studentId);
            var length = result.length;
            var sql0 = sqlmap.checkadmin_acco_mes + ' where A.studentId = ?';
            for(var i=0; i<length; i++){
                var p = result[i].studentId;
                var build = [];
                pool.query(sql0, p, function (error, res) {
                    console.log(res);
                    console.log('123')
                    if (error) {
                        throw error;
                    }
                    build.push(res[0]['buildingId']);
                    build.push(res[0]['roomId']);
                });
                console.log(build)
                result[i].buildingId_holiday = build[0];
                result[i].roomId_holiday = build[1];
            }*/
            console.log(result);
            page.page1 = true;
            res.render('admin', {name: session['name'], stu_mes: result, page});
        });
    }
})
module.exports = router;