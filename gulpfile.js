var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch'),
    connect = require('gulp-connect');

gulp.task('app', function () {
    gulp.src('app/**')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch("app/**", ['app']);
});

gulp.task('lr', ['watch'], function () {
    connect.server({
        root: "app",
        port: 8001,
        livereload: true
    });
});