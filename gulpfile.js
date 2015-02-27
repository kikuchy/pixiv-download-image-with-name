'use strict';

var gulp = require('gulp');
var del = require('del');
var eslint = require('gulp-eslint');
var gutil = require('gulp-util');
var debug = require('gulp-debug');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

// Extensionに含める静的ファイル群をコピー
gulp.task('copy', function () {
    gulp.src('css/*.css').pipe(
        gulp.dest('packaging/css')
    );
    gulp.src('icons/*.png').pipe(
        gulp.dest('packaging/icons')
    );
    gulp.src('lib/backgrounds.js').pipe(
        gulp.dest('packaging/lib')
    );
    return gulp.src(['manifest.json', 'options.html', 'options.js']).pipe(
        gulp.dest('packaging/')
    );
});

// 以前は分割したファイルを単純に結合していたのでconcat。
// 今はbuildとかの方が良いのかもしれない
gulp.task('concat', function () {
    return browserify({
        entries: ['./lib/trigger.js']
    })
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./packaging/includes'));
});

// 一時ファイルを削除
gulp.task('clean', function (cb) {
    del([
        'packaging/**'
    ], cb);
});

gulp.task('lint', function () {
    gulp.src('lib/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('watch', ['copy', 'concat'], function () {
    gulp.watch('lib/*.js', ['lint', 'concat']);
});

gulp.task('default', ['clean', 'lint'], function () {
    gulp.start('copy');
    return gulp.start('concat');
});
