var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var hbs = require('hbs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var studentRouter = require('./routes/student');
var adminRouter = require('./routes/admin');
var repairRouter = require('./routes/repair');
var introRouter = require('./routes/intro');
var conRepRouter = require('./routes/con_rep');
var conAdmRouter = require('./routes/con_adm');
var conAdm_allowRouter = require('./routes/admin_allow');
var con_rep_statusRouter = require('./routes/rep_status');  // 维修申请状态
var process_repRouter = require('./routes/process_rep');  // 处理维修申请表
var solve_repRouter = require('./routes/solve_rep');  // 维修人员处理申请状态

var app = express();

//session

app.use(cookieParser('abcd'));

app.use(session({
  secret: '12345',
  rolling: true,
  name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {maxAge: null, name:null },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
  resave: false,
  saveUninitialized: true,
}));


app.use(favicon(path.join(__dirname, './public/images/favicon.ico'))); //'public', 'favicon.ico')));//使用小图标
// view engine setup
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/particials');
//hbs.registerPartials(__dirname + '/views/admin_part');
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(bodyParser.json());// 定义数据解析器
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/student', studentRouter);
app.use('/admin', adminRouter);
app.use('/repair', repairRouter);
app.use('/intro', introRouter);//网站简介
app.use('/con_adm', conAdmRouter);
app.use('/con_rep', conRepRouter);
app.use('./admin_allow', conAdm_allowRouter);
app.use('/rep_status', con_rep_statusRouter); // 维修申请状态
app.use('/process_rep', process_repRouter); // 维修申请状态
app.use('/solve_rep', solve_repRouter); // 维修人员处理维修申请状态


//设置允许跨域请求
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
  res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
  res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
