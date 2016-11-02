var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var gulp = require('gulp');
var RevAll = require('gulp-rev-all');
var clean = require('gulp-clean');
var revReplace= require('gulp-rev-replace');
var Rev = require('gulp-rev');
var configRevReplace = require('gulp-requirejs-rev-replace');


gulp.task('default',['clean'], function () {
 
  gulp
    .src('js/**')
    .pipe(RevAll.revision({hashLength:6}))
    .pipe(gulp.dest('cdn'))
    .pipe(RevAll.manifestFile())
    .pipe(gulp.dest('cdn'));
 
});


gulp.task("revreplace", ["makeRev"], function(){
  var manifest = gulp.src("cdn/rev-manifest.json");
 
  return gulp.src("js/app.js")
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest("js"));
});


gulp.task('clean', function () {
    return gulp.src('cdn', {read: false})
        .pipe(clean());
});


gulp.task('makeRev',['clean'],function(){
  gulp
    .src('js/**')
    .pipe(Rev())
    .pipe(gulp.dest('cdn'))
    .pipe(Rev.manifest())
    .pipe(gulp.dest('cdn'));
});

gulp.task('ReConfig',['makeRev'],function(){
     
    gulp.src('js/app.js')
    .pipe(configRevReplace({
        manifest: gulp.src("cdn/rev-manifest.json")
    }))
    .pipe(gulp.dest('cdn'));
});