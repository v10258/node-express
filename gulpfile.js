var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var pngquant = require('imagemin-pngquant');

var webpackConfig = require('./webpack.config.js');

//var browserSync = require('browser-sync');
//var reload = browserSync.reload;

var fs = require('fs');
var path = require('path');

var config = {
    src: 'public/src',          // css js img scss 资源目录 开头和结尾不需要/
    subdir: '',             // css js img scss 资源目录 明确指向可以使开发过程中只处理此目录下的文件提高效率 请以/开头 结尾不需要/
    html: 'pages',          // 页面模板文件目录
    dist: 'public/dist',           // build 构建目录
    rev: 'public/rev',             // 版本构建目录
    production: !!plugins.util.env.production   // 当前为生产环境
};

// mock 中间件
var mock = function(req, res, next) {
    var urlReg = /^\/mock\/(.*)/,
        match = req.url.match(urlReg),
        result,
        filePath,
        segments;
        
    plugins.util.log('request from client:' + req.url);

    if (!match) {
        plugins.util.log('not matched,passed...');
        return next();
    }

    segments = match[1].split('/').map(function(n) {
        return /\d+/.test(n) ? 'N' : n;
    });
    filePath = path.join('mock', segments.join('.')) + '.json';

    plugins.util.log('parsed filePath:' + filePath);
    fs.exists(filePath, function(exists) {
        if (exists) {
            result = fs.readFileSync(filePath, 'utf-8');
        } else {
            result = JSON.stringify({
                "success": false,
                "message": 'mock data file:[' + filePath + '] doesn\'t exist!'
            });
        }

        plugins.util.log('fs.exists result:' + result);

        res.setHeader("Content-Type", "application/json");
        res.end(result);
    });

    plugins.util.log('request from client:' + req.url);

    next();
}

// 压缩图片
gulp.task('image', function() {
    console.log(plugins.util.colors.green('Minify images'));

    return gulp.src(config.src + '/image' + config.subdir + '/**/*.+(png|jpg|gif)')
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.dist + '/image'))
        .pipe(plugins.notify({ message: 'images task ok' }));
});


// 编译Scss 合并、压缩、生成css
gulp.task('scss', function() {
    console.log(plugins.util.colors.green('compile scss into css'));

    return gulp.src([config.src + '/scss/*.scss'])
        .pipe(plugins.plumber(function(){}))
        .pipe(config.production ? plugins.sass({
            outputStyle: 'compressed'
        }) : plugins.sass())
        .pipe(config.production ? plugins.base64({
            extensions: ['svg', 'png', /\.jpg#datauri$/i], // 指定转换条件
            maxImageSize: 2 * 1024, // bytes，<=2kb转base64
        }) : plugins.sass())
        .pipe(gulp.dest(config.dist + '/css'))
        /*.pipe(reload({
            stream: true
        }))*/
        .pipe(plugins.notify({
            message: 'scss task ok'
        }));
});


// 清空版本生成文件
gulp.task('clean:rev', function(){
    return gulp.src(config.rev, {read: false})
        .pipe(plugins.clean());
})


// 生成MD5文件版本
//gulp.task('rev', ['clean:rev'], function() {
gulp.task('rev', function() {
	var now = new Date(),
		datetime = "" + now.getFullYear() + (now.getMonth()+1) + now.getDate();

    return gulp.src([config.dist + '/js/**/*.*', config.dist + '/css/**/*.*'])
        .pipe(plugins.rev())
        .pipe(gulp.dest(config.rev))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest(config.rev + '/' + datetime))
})


// 替换html摸板中的文件为最新的MD5版本
gulp.task('revcollector', ['rev'], function() {

    return gulp.src([config.rev + '/*.json', config.dist + '/**/*.html'])
        .pipe(plugins.revCollector({
            replaceReved: true,
            dirReplacements: {
                '../dist': './'
            }
        }))
        .pipe(gulp.dest(config.rev))
})

// 编译引入的组件
gulp.task('fileinclude', function() {
    return gulp.src(config.html + '/**/*.html')
        .pipe(plugins.fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(config.dist));
});


// 检查脚本
gulp.task('jshint', function() {
    console.log(plugins.util.colors.green('jshint execute...'));

    return gulp.src(config.src + '/js' + config.subdir + '/**/*.js')
        .pipe(plugins.cached('jshint'))
        .pipe(plugins.plumber())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'));
});

// webpack 打包js
gulp.task("webpack", ['jshint'], function(callback) {

    return gulp.src('')
        .pipe(plugins.webpack(require('./webpack.config.js')))
        .pipe(config.production ? plugins.uglify({
                compress: {
                  drop_console: true
                }
            }) : plugins.util.noop())
        .pipe(gulp.dest(config.dist + '/js'))
        .pipe(plugins.notify({ message: 'webpack task ok'}));
});


// 静态服务器 + 监视 less/html 文件
gulp.task('live', function() {

	/*
    browserSync({
        server: './',
        middleware: [mock]
    });
	*/

    gulp.watch(config.src + '/js/' + config.subdir + '/**/*.js', ['webpack']);
    gulp.watch(config.src + '/**/*.scss', ['scss']);
    //gulp.watch(config.html + '/**/*.html').on('change', reload);
});

// 发布，更新版本 任务
gulp.task('release', ['revcollector']);

// bulid 任务
gulp.task('build', ['image']);

// 默认任务
gulp.task('default', ['scss', 'webpack', 'live']);