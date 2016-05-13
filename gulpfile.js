// 引用外掛
var gulp = require('gulp'),
	// jade
	jade = require('gulp-jade'),
	// postCss
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer')
	sass = require('gulp-sass'),
	lost = require('lost'),
	rucksack = require('rucksack-css'),
	// 整個sass資料夾import
	bulkSass = require('gulp-sass-bulk-import'),
	// markdown
	markdown = require('gulp-markdown'),
	// 壓縮js
	uglify = require('gulp-uglify'),
	// 壓縮css
	minifyCSS = require('gulp-minify-css'),
	// 重新命名min檔用
	rename = require("gulp-rename"),
	// 打包css、js
	concat = require('gulp-concat'),
	// 偵錯工具
	plumber = require('gulp-plumber'),
	notify = require("gulp-notify"),
	// sourcemap
	sourcemaps = require('gulp-sourcemaps'),
	// webServer
	webServer = require('gulp-webserver');

// 路徑
var srcJade = './template/**/*.jade',
	endJade = './',
	srcSass = ['./assets/sass/**/*.sass', './assets/sass/**/*.scss'],
	endSass = './assets/css/',
	srcBundleCss = ['./assets/css/*.css', './assets/vendor/**/*.css'],
	endBundleCss = './assets/bundle/css/',
	srcJs = ['./assets/vendor/**/*.js', './assets/js/*.js'],
	endBundleJs = './assets/bundle/js/',
	srcMark = './*.md';
	endMark = './';

// webServer網址
var serverSite = 'seansu.local';

// sass編譯css的排列
/*
	nested: 一般css，但尾巴在同一行
	expanded: 完整的css排列
	compact: 每一段變成一行
	compressed: 壓縮成一行
*/
var sassCompile = 'expanded';

// jade
gulp.task('template', function(){
	return gulp.src(srcJade)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(endJade))
		.pipe(notify({
			message: 'Jade Compily'
		}));
});


// 讓sass可以import css
gulp.task('css', function () {
	gulp.src('assets/vendor/**/*.css')
		.pipe(importCss())
		.pipe(gulp.dest(endSass));
});

// postCss
gulp.task('styles', function () {
	var processors = [
		lost,
		rucksack({fallbacks: true}),
		autoprefixer({browsers: ['last 2 version']})
	];
	return gulp.src(srcSass)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sourcemaps.init())
		.pipe(bulkSass())
		.pipe(sass({outputStyle: sassCompile}).on('error', sass.logError))
		.pipe(postcss(processors))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(endSass));
});

// 合併、壓縮css
gulp.task('concat', function() {
	return gulp.src(srcBundleCss)
		.pipe(concat('bundle.css'))
		.pipe(minifyCSS({
			keepBreaks: false,
		}))
		.pipe(rename(function(path) {
			path.basename += ".min";
			path.extname = ".css";
		}))
		.pipe(gulp.dest(endBundleCss))
		.pipe(notify({
			message: 'Sass Compily'
		}));
});

// 合併、壓縮js檔案
gulp.task('compress', function() {
	return gulp.src(srcJs)
		.pipe(concat('bundle.js'))
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(uglify())
		.pipe(rename(function(path) {
			path.basename += ".min";
			path.extname = ".js";
		}))
		.pipe(gulp.dest(endBundleJs))
		.pipe(notify({
			message: 'js Compily'
		}));
});

// markdown
gulp.task('markdown', function() {
	return gulp.src(srcMark)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(markdown())
		.pipe(gulp.dest(endMark))
		.pipe(notify({
			message: 'Markdown Success'
		}));
});

// 監聽
gulp.task('watch', function(){
	gulp.watch(srcJade, ['template']);
	gulp.watch(srcSass, ['styles']);
	gulp.watch(srcBundleCss, ['concat']);
	gulp.watch(srcJs, ['compress']);
	gulp.watch(srcMark, ['markdown'])
});

// server
gulp.task('webServer', function() {
	gulp.src('./')
		.pipe(webServer({
			host: serverSite,
			fallback: 'index.html',
			livereload: true
		}));
});

// cmd輸入"gulp"時，要執行的task
gulp.task('default', ['template', 'styles', 'markdown', 'concat', 'compress', 'webServer', 'watch']);