/*!
 * blog-mex.js
 * @date 2015.12.6
 * @author chenjinghui@meizu.com
 * @version 0.0.1
 */

// 引入依赖
var http = require('http');
var path = require('path');
var fs = require('fs');

var express = require('express');
var exphbs = require('express-handlebars');

// express 中间件
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var errorHandler = require('errorhandler');
var flash = require('connect-flash');


// orm
var mongoose = require('mongoose');


var config = require('./config.js');
var models = require('./models');
//var routes = require('./routes');
var routes = require('./routes-v');

// 实例化express
var app = express();

var environment = process.env.NODE_ENV || 'development';
var configOptions = config[environment];


// 连接数据库
mongoose.connect(configOptions.database.connectionString, {safe: true});
mongoose.connection.on('open', function(){
    console.log('open connect');
})

// All environments Settings
app.set('port', process.env.PORT || 3000);
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('views', path.join(__dirname, 'views'));
// 缺省状态下默认的模板引擎
app.set('view engine', '.hbs');


// 引入静态文件处理
app.use(logger('dev'));
app.use(bodyParser());
//app.use(cookieParser());


// 设置静态文件目录
app.use(express.static(__dirname + '/public'));

// session 中间件
app.use(expressSession({
    name: configOptions.session.key,
    secret: configOptions.session.secret,
    cookie: {
        maxAge: configOptions.session.maxAge
    },
    store: new MongoStore({ // 将 session 存储到 mongodb
        url: configOptions.database.connectionString
    })
}));

// flash 中间价，用来显示通知
app.use(flash());

// Authorization
/*var authorize = function(req, res, next) {
  if (req.session && req.session.admin)
    return next();
  else
    return res.send(401);
};*/

// Development only
if ('development' === app.get('env')) {
  app.use(errorHandler());
}

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

// 路由
routes(app);

var autoViews = {};
app.use(function(req, res, next) {
    var path = req.path.toLowerCase();
    // 检查缓存；如果它在那里，渲染这个视图
    if (autoViews[path]) return res.render(autoViews[path]);
    // 如果它不在缓存里，那就看看有没有 .handlebars 文件能匹配
    if (fs.existsSync(__dirname + '/views' + path + '.hbs')) {
        autoViews[path] = path.replace(/^\//, '');
        return res.render(autoViews[path]);
    }
    // 没发现视图；转到 404 处理器
    next();
});


// 定制 404 页面
app.use(function(req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});
// 定制 500 页面
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

// 监听服务器端口
app.listen(configOptions.server.port, function() {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});