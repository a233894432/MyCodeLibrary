'use strict';
const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const rimraf = require('rimraf');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-cssnano');
const runSequence = require('run-sequence');
const insert = require('gulp-insert');
const exec = require('child_process').exec;
const pkg = require('./package.json');

const postcssConfig = [autoprefixer({
    browsers: [
        'last 5 iOS versions',
        'last 5 Android versions',
        'last 5 ExplorerMobile versions',
        'last 5 ChromeAndroid versions',
        'last 5 UCAndroid versions',
        'last 5 FirefoxAndroid versions',
        'last 5 OperaMobile versions',
        'last 5 OperaMini versions',
        'last 5 Samsung versions',

        'last 3 Chrome versions',
        'last 3 Firefox versions',
        'last 3 Safari versions',
        'last 3 Edge versions',
    ]
})];

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');
const SITE_DIR = path.resolve(__dirname, 'site');
const SITE_THEME_MOBI_CSS_DIR = path.resolve(SITE_DIR, 'themes/');

gulp.task('default', ['hexo', 'build_copy'], () => {
    gulp.watch([
        `${SRC_DIR}/**/*`,
    ], ['build_copy']);
});

gulp.task('build_copy', () => {
    setTimeout(() => {
        runSequence('build', 'copy');
    }, 300);
});

gulp.task('build', [
    'clean:dist',
    'build:sourcemaps',
    'build:compressed',
]);

gulp.task('watch', () => {
    gulp.watch([
        `${SRC_DIR}/**/*`,
    ], ['build']);

});

gulp.task('copy', [
    'clean:site_theme_mobi_css',
    'copy:site_theme_mobi_css',
]);

gulp.task('hexo', () => {
    console.log(`cd ${SITE_DIR} && npm install && npm start`);
    const child = exec(`cd ${SITE_DIR} && npm install && npm start`);
    child.stderr.pipe(process.stderr);
    child.stdout.pipe(process.stdout);
});

gulp.task('clean:dist', () => {
    rimraf.sync(`${DIST_DIR}/*`);
});

gulp.task('build:compressed', ['build:sourcemaps'], () => gulp.src(`${DIST_DIR}/dio.css`)
    .pipe(cleanCSS())
    .pipe(insert.prepend(`/* dio.css v${pkg.version} - ${pkg.homepage} */\n`))
    .pipe(rename('dio.min.css'))
    .pipe(gulp.dest(DIST_DIR)));

gulp.task('build:sourcemaps', () => gulp.src(`${SRC_DIR}/sass/dio.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postcssConfig))
    .pipe(insert.prepend(`/* dio.css v${pkg.version} - ${pkg.homepage} */\n`))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DIST_DIR)));

gulp.task('clean:site_theme_mobi_css', () => {
    rimraf.sync(`${SITE_THEME_MOBI_CSS_DIR}/*`);
});

gulp.task('copy:site_theme_mobi_css', () => gulp.src(`${DIST_DIR}/*`)
    .pipe(gulp.dest(`${SITE_THEME_MOBI_CSS_DIR}/`)));