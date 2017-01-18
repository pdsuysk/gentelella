var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    Proxy = require('gulp-connect-proxy'),
    connect = require('gulp-connect');

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
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './bigaka/html/index.html'
    });
});

gulp.task('watch', function() {
  // Watch .html files
  gulp.watch('production/*.html', browserSync.reload);
  // Watch .js files
  gulp.watch('src/js/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch('src/scss/*.scss', ['sass', 'sass-minify']);
});

// 配置跨域代理服务器，
// 例如：请求 http://mkj001.bigaka.com/mkj/api/area/list
// 可以通过请求 http://localhost:8000/proxy/mkj001.bigaka.com/mkj/api/area/list
// 实现跨域访问
gulp.task('server', function() {
  connect.server({
    root: 'app',
    port: 8000,
    livereload: true,
    middleware: function (connect, opt) {
      opt.route = '/proxy';
      var proxy = new Proxy(opt);
      return [proxy];
    }
  })
})

// Default Task
gulp.task('default', ['server', 'browser-sync', 'watch']);
