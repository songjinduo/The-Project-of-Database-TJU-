# 数据库课程设计大作业——假期留校宿舍管理系统
##### 主目录
* code——源代码
* 设计说明书——项目文档
* 系统安装说明书
* 展示——ppt讲解展示
##### 源代码目录
* bin——入口文件存放目录
* config——数据库配置目录（包括数据可配置信息和大部分的sql语句）
* public——静态文件存放目录
  * data——存放json数据
  * extra——存放Echarts的html文件
  * images——存放图片文件
  * javascripts——存放js的相关库（例如jquery)
  * notice——公告的静态html文件
  * stylesheets——存放css相关文件
* routes——存放路由js文件
  * admin.js——管理员主界面逻辑
  * con_adm.js——联系管理员界面逻辑
  * con_rep.js——联系维修人员界面逻辑
  * index.js——系统主界面逻辑
  * intro.js——网站简介界面逻辑
  * login.js——登录逻辑
  * process_rep.js——处理维修申请表逻辑
  * rep_status.js——显示学生视图的维修状态逻辑
  * repair.js——维修人员界面逻辑
  * solve_rep.js——处理问题申请的解决状态逻辑
  * student.js——学生界面逻辑
* view——存放系统页面文件(hbs模板)
  * particials——网站头和尾部格式文件
  * admin.hbs——管理员界面
  * con_admin.hbs——联系管理员
  * con_rep.hbs——联系维修人员
  * index.hbs——系统主界面
  * intro.hbs——网站简介
  * login.hbs——登录界面
  * Modify.hbs——管理员的修改界面
  * rep_status——维修申请界面
  * repair.hbs——维修人员界面
  * student.hbs——学生界面
* app.js——应用核心配置文件
* package.json——项目依赖配置及开发者信息
##### 运行（命令行）
  * npm install——下载所有依赖库
  * npm start——运行项目（端口：5000）
##### 项目功能结构图
  ![image](https://github.com/songjinduo/database/blob/master/images/%E5%8A%9F%E8%83%BD%E7%BB%93%E6%9E%84%E5%9B%BE.png)
##### 项目部分界面展示
* 系统主界面
 ![image](https://github.com/songjinduo/database/blob/master/images/%E9%A6%96%E9%A1%B5.png)
* 管理员界面
 ![image](https://github.com/songjinduo/database/blob/master/images/localhost_5000_admin%20(2).png)
* 联系管理员
 ![image](https://github.com/songjinduo/database/blob/master/images/con_rep.png)
