/**
 * Created by diogoxiang on 2016年9月13日17:11:27
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'), //让命令行输出的文字带颜色
    uglify = require('gulp-uglify'),// 获取 uglify 模块（用于压缩 JS）
    cssnano = require('gulp-cssnano'), // 获取 minify-css 模块（用于压缩 CSS）这个是最新的
    imagemin = require('gulp-imagemin'),  // 获取 gulp-imagemin 模块
    sass = require('gulp-ruby-sass'),     // 获取 gulp-ruby-sass 模块
    rename = require('gulp-rename'),     //重命名
    concat = require('gulp-concat'),     //合并文件
    clean = require('gulp-clean'),        //清空文件夹
    sourcemaps = require('gulp-sourcemaps'), //map调试
    combiner = require('stream-combiner2'), //监听错误
    watchPath = require('gulp-watch-path'), //实际上我们只需要重新编译被修改的文件
    headerFooter = require('gulp-header-footer'),
    rev = require('gulp-rev'),             //gulp 自动添加版本号
    revCollector = require('gulp-rev-collector'),
    htmlreplace = require('gulp-html-replace'); //输出的html 替换



var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n');
    gutil.log(colors.red('Error!'));
    gutil.log('fileName: ' + colors.red(err.fileName));
    gutil.log('lineNumber: ' + colors.red(err.lineNumber));
    gutil.log('message: ' + err.message);
    gutil.log('plugin: ' + colors.yellow(err.plugin))
};


//photoSwipe_手机端图片浏览组件(左右划动,缩放)
var PSpaths = {
    js: './photoSwipe_src/js',
    sass: './photoSwipe_src/sass',
    dest: './photoSwipe_bin/'
};


//默认方法
gulp.task('default', function () {
    gutil.log('message');
    gutil.log(gutil.colors.green('message:') + "This is default fn");
});


//合并Photo Swipe JS模块
gulp.task('photoSwipe:buildJs', function () {

    var combined = combiner.obj([
        gulp.src([PSpaths.js + '/vedor/framework-bridge.js',PSpaths.js + '/vedor/core.js',PSpaths.js + '/vedor/gestures.js',PSpaths.js + '/vedor/show-hide-transition.js',PSpaths.js + '/vedor/items-controller.js',PSpaths.js + '/vedor/tap.js',PSpaths.js + '/vedor/desktop-zoom.js',PSpaths.js + '/vedor/history.js']),
        concat('verdor.js',{newLine: '\/* new js *\/ \n'}),
        headerFooter({
            header:'(function (root, factory) {' +
            'if (typeof define === \'function\' && define.amd) {' +
            'define(factory);' +
            '} else if (typeof exports === \'object\') {' +
            'module.exports = factory();' +
            '} else {' +
            'root.PhotoSwipe = factory();' +
            '}' +
            '})(this, function () {' +
            '\'use strict\';' +
            'var PhotoSwipe = function(template, UiClass, items, options){',
            footer:'framework.extend(self, publicMethods); };' +
            'return PhotoSwipe;' +
            '});',
            filter: function(file){
                return true
            }
        }),
        gulp.dest(PSpaths.dest)
    ]);
    combined.on('error', handleError);
});

gulp.task("test:header",function(){
    var combined= combiner.obj([
        gulp.src(PSpaths.js + '/vedor/framework-bridge.js'),
        headerFooter({
            header:'(function (root, factory) {' +
            'if (typeof define === \'function\' && define.amd) {' +
            'define(factory);' +
            '} else if (typeof exports === \'object\') {' +
            'module.exports = factory();' +
            '} else {' +
            'root.PhotoSwipe = factory();' +
            '}' +
            '})(this, function () {' +
            '\'use strict\';' +
            'var PhotoSwipe = function(template, UiClass, items, options){',
            footer:'framework.extend(self, publicMethods); };' +
            'return PhotoSwipe;' +
            '});',
            filter: function(file){
                return true
            }
        }),
        gulp.dest(PSpaths.dest)

    ]);

    combined.on('error', handleError);
});