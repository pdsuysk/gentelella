var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    proxy = require('http-proxy-middleware');

var DEST = 'build/';

gulp.task('scripts', function() {
    return gulp.src([
        'src/js/helpers/*.js',
        'src/js/*.js',
      ])
      .pipe(concat('custom.js'))
      .pipe(gulp.dest(DEST+'/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(DEST+'/js'))
      .pipe(browserSync.stream());
});

// TODO: Maybe we can simplify how sass compile the minify and unminify version
var compileSASS = function (filename, options) {
  return sass('src/scss/*.scss', options)
        .pipe(autoprefixer('last 2 versions', '> 5%'))
        .pipe(concat(filename))
        .pipe(gulp.dest(DEST+'/css'))
        .pipe(browserSync.stream());
};

gulp.task('sass', function() {
    return compileSASS('custom.css', {});
});

gulp.task('sass-minify', function() {
    return compileSASS('custom.min.css', {style: 'compressed'});
});

gulp.task('browser-sync', function() {
    var apiProxy = proxy('/wx_big_data', {
      target: 'http://test02.bigaka.com',
      // target: 'http://company1.bigaka.com:9101',
      changeOrigin: true,
      logLevel: 'debug'
    });
    browserSync.init({
        server: {
          baseDir: './',
          middleware: [apiProxy]
        },
        ghostMode: false, // 关闭镜像功能
        port: 9006,
        startPath: './bigaka/html/index.html'
    });
});

gulp.task('watch', function() {
  // Watch .html files
  gulp.watch(['bigaka/html/*.html', 'bigaka/js/*.js', 'bigaka/css/*.css'], browserSync.reload);
  // Watch .js files
  gulp.watch('src/js/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch('src/scss/*.scss', ['sass', 'sass-minify']);
});


// Default Task
gulp.task('default', ['browser-sync', 'watch']);
